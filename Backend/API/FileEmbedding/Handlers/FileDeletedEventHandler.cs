using API.Data;
using API.Enums;
using API.FileEmbedding.Messages;
using API.FileEmbedding.Services;
using Microsoft.EntityFrameworkCore;

namespace API.FileEmbedding.Handlers;

public class FileDeletedEventHandler : IHandleMessages<FileDeletedEvent>
{
    private readonly DatabaseContext _dbContext;
    private readonly ILogger<FileDeletedEventHandler> _logger;
    private readonly AppSettings _appSettings;

    public FileDeletedEventHandler(DatabaseContext dbContext, ILogger<FileDeletedEventHandler> logger, AppSettings appSettings)
    {
        _dbContext = dbContext;
        _logger = logger;
        _appSettings = appSettings;
    }

    public async Task Handle(FileDeletedEvent message, IMessageHandlerContext context)
    {
        try
        {
            _logger.LogInformation("File delete event received for {fileGuid}", message.Guid);
            
            var file = await _dbContext.Files.FirstOrDefaultAsync(f => f.Guid == message.Guid, context.CancellationToken);
            if (file == null || file.Status != FileStatus.Embedded)
            {
                _logger.LogError("File {fileGuid} not processed or already deleted.", message.Guid);
                return;
            }

            var qdrantClient = new QdrantClient(_appSettings.QdrantUrl);
            await qdrantClient.DeleteEmbeddingsByFileIdAsync(file.UserId.ToString(), file.Guid);

            _logger.LogInformation("File embedding successfully deleted for {fileGuid}", message.Guid);
        }
        catch (Exception ex)
        {
            _logger.LogError("File embeddings removal failed: {error}", ex.Message);
        }
    }
}
