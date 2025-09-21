using API.Data;
using API.Data.Domain;
using API.Dto.FileManagement;
using API.Enums;
using API.FilesManagement.FileEmbedding.Messages;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;
using static API.FilesManagement.FileValidator;
using static API.FilesManagement.FileReader;

namespace API.FilesManagement;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FilesManagementController : Controller
{
    private readonly ILogger<FilesManagementController> _logger;
    private readonly DatabaseContext _dbContext;
    private readonly IMessageSession _messageSession;
    private readonly IUsageService _usageService;

    public FilesManagementController(DatabaseContext dbContext, ILogger<FilesManagementController> logger, IMessageSession messageSession, IUsageService usageService)
    {
        _dbContext = dbContext;
        _logger = logger;
        _messageSession = messageSession;
        _usageService = usageService;
    }

    [HttpGet("file")]
    public async Task<IActionResult> GetFile(string fileId)
    {
        _logger.LogInformation("Get file request received for {fileId}", fileId);
        var userIdHeader = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdHeader == null || !int.TryParse(userIdHeader, out int userId))
        {
            _logger.LogError("Valid User Id header not found");
            return StatusCode((int)HttpStatusCode.Unauthorized, "Valid User Id header not found");
        }

        var file = await _dbContext.Files.FirstOrDefaultAsync(file => file.Guid == fileId && file.UserId == userId);
        if (file == null)
        {
            _logger.LogError("File with id: {fileId} does not exist", fileId);
            return NotFound("File does not exist");
        }

        return new OkObjectResult(file);
    }

    [HttpGet("filesSummary")]
    public async Task<IActionResult> GetFilesSummary()
    {
        _logger.LogInformation("Get file summary request received");
        var userIdHeader = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdHeader == null || !int.TryParse(userIdHeader, out int userId))
        {
            _logger.LogError("Valid User Id header not found");
            return StatusCode((int)HttpStatusCode.Unauthorized, "Valid User Id header not found");
        }

        var files = await _dbContext.Files
            .Where(f => f.UserId == userId)
            .Select(f => new FileSummary
            {
                Guid = f.Guid,
                Name = f.Name,
                Size = f.Size,
                UploadDate = f.UploadDate.Date,
                Status = f.Status
            })
            .ToListAsync();

        return new OkObjectResult(files);
    }

    [HttpPost("file")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadFile([FromForm] FileUploadRequest request)
    {
        _logger.LogInformation("File upload request received for file: {filename}", request.File.FileName);
        var userIdHeader = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdHeader == null || !int.TryParse(userIdHeader, out int userId))
        {
            _logger.LogError("Valid User Id header not found");
            return StatusCode((int)HttpStatusCode.Unauthorized, "Valid User Id header not found");
        }

        var file = request.File;
        var validationResult = ValidateFile(file);
        if (validationResult.Count > 0)
        {
            return new BadRequestObjectResult(string.Join(". ", validationResult) + '.');
        }

        var fileStorageLimit = await _usageService.CheckResourceUsage(Resource.FileStorage, userId, file.Length);
        if (fileStorageLimit != 0)
        {
            _logger.LogError("File storage limit reached with code {code}", fileStorageLimit);
            return new BadRequestObjectResult(fileStorageLimit == 1 ?
                "You have reached your file storage limit. Delete previous files to add more." :
                "You will exceed your file storage limit on uploading this file. Delete previous files to add more.");
        }

        var content = await ReadFile(file);

        var embeddingLimit = await _usageService.CheckResourceUsage(Resource.TextEmbedding3Small, userId, _usageService.GetExpectedTokensCount(content));
        if (embeddingLimit != 0)
        {
            _logger.LogError("Embedding limit reached with code {code}", embeddingLimit);
            return new BadRequestObjectResult(embeddingLimit == 1 ?
                "You have reached your monthly file embedding limit." :
                "You will exceed your monthly file embedding limit on uploading this file.");
        }

        var fileGuid = Guid.NewGuid().ToString();
        await _dbContext.AddAsync<DataFile>(new DataFile
        {
            Guid = fileGuid,
            Name = file.FileName,
            RawContent = content,
            UploadDate = DateTime.UtcNow.Date,
            Size = file.Length,
            UserId = userId,
            Status = FileStatus.Uploaded
        });
        await _dbContext.SaveChangesAsync();

        await _usageService.UpdateResourceUsage(Resource.FileStorage, userId, file.Length);

        var fileAddedEvent = new FileUploadedEvent { Guid = fileGuid, UserId = userId };
        await _messageSession.Publish(fileAddedEvent);

        return StatusCode((int)HttpStatusCode.Created, $"File uploaded successfully. File Guid: {fileGuid}");
    }

    [HttpDelete("file")]
    public async Task<IActionResult> DeleteFile(string fileId)
    {
        _logger.LogInformation("Delete file request received for file id {fileId}", fileId);
        var userIdHeader = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdHeader == null || !int.TryParse(userIdHeader, out int userId))
        {
            _logger.LogError("Valid User Id header not found");
            return StatusCode((int)HttpStatusCode.Unauthorized, "Valid User Id header not found");
        }

        var file = await _dbContext.Files.FirstOrDefaultAsync(f => f.Guid == fileId && f.UserId == userId);
        if (file == null)
        {
            _logger.LogError("File with id: {fileId} does not exist", fileId);
            return NotFound("File does not exist");
        }
        
        await _usageService.UpdateResourceUsage(Resource.FileStorage, userId, -file.Size);

        var fileDeletedEvent = new FileDeletedEvent { Guid = fileId, UserId = file.UserId };
        await _messageSession.Publish(fileDeletedEvent);

        _dbContext.Files.Remove(file);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
