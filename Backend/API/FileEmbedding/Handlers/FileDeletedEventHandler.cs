using API.FileEmbedding.Messages;
using API.FileEmbedding.Services;

namespace API.FileEmbedding.Handlers;

public class FileDeletedEventHandler : IHandleMessages<FileDeletedEvent>
{
    private readonly ILogger<FileDeletedEventHandler> _logger;
    private readonly AppSettings _appSettings;

    public FileDeletedEventHandler(ILogger<FileDeletedEventHandler> logger, AppSettings appSettings)
    {
        _logger = logger;
        _appSettings = appSettings;
    }

    public async Task Handle(FileDeletedEvent message, IMessageHandlerContext context)
    {
        try
        {
            _logger.LogInformation("File delete event received for {fileGuid}", message.Guid);
            var qdrantClient = new QdrantClient(_appSettings.QdrantUrl);
            await qdrantClient.DeleteEmbeddingsByFileIdAsync(message.UserId.ToString(), message.Guid);

            _logger.LogInformation("File embedding successfully deleted for {fileGuid}", message.Guid);
        }
        catch (Exception ex)
        {
            _logger.LogError("File embeddings removal failed: {error}", ex.Message);
        }
    }
}
