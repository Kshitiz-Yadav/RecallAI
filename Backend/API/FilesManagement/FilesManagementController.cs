using API.Data;
using API.Data.Domain;
using API.Dto.FileManagement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;
using static API.FilesManagement.FileValidator;

namespace API.FilesManagement;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FilesManagementController : Controller
{
    private readonly ILogger<FilesManagementController> _logger;
    private readonly DatabaseContext _dbContext;

    public FilesManagementController(DatabaseContext dbContext, ILogger<FilesManagementController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
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
                UploadDate = f.UploadDate.Date
            })
            .ToListAsync();

        return new OkObjectResult(files);
    }

    [HttpPost("file")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadTextFile([FromForm] FileUploadRequest request)
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
            return new BadRequestObjectResult(string.Join(". ", validationResult));
        }

        var userLimits = await _dbContext.UserLimits.FirstOrDefaultAsync(l => l.UserId == userId);
        if (userLimits == null)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, "No limits were defined for this user");
        }

        if(userLimits.UsedStorage + file.Length > userLimits.MaxStorage)
        {
            _logger.LogInformation("Storage limit reached");
            return StatusCode((int)HttpStatusCode.BadRequest, "You will exceed your storage limit on uploading this file. Delete previous files to add more.");
        }

        string content;
        using (var reader = new StreamReader(file.OpenReadStream()))
        {
            content = await reader.ReadToEndAsync();
        }

        var fileGuid = Guid.NewGuid().ToString();
        await _dbContext.AddAsync<DataFile>(new DataFile
        {
            Guid = fileGuid,
            Name = file.Name,
            RawContent = content,
            UploadDate = DateTime.UtcNow.Date,
            Size = file.Length,
            UserId = userId
        });

        userLimits.UsedStorage += file.Length;
        await _dbContext.SaveChangesAsync();

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

        var userLimits = await _dbContext.UserLimits.FirstOrDefaultAsync(l => l.UserId == userId);
        if (userLimits == null)
        {
            return StatusCode((int)HttpStatusCode.InternalServerError, "No limits were defined for this user");
        }

        userLimits.UsedStorage -= file.Size;
        _dbContext.Files.Remove(file);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
