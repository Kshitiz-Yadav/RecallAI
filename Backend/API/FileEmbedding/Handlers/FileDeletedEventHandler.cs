using API.FileEmbedding.Messages;
using API.FileEmbedding.Services;

namespace API.FileEmbedding.Handlers;

public class FileDeletedEventHandler : IHandleMessages<FileDeletedEvent>
{
    private readonly ILogger<FileDeletedEventHandler> _logger;
    private readonly IQdrantClient _qdrantClient;

    public FileDeletedEventHandler(ILogger<FileDeletedEventHandler> logger, IQdrantClient qdrantClient)
    {
        _logger = logger;
        _qdrantClient = qdrantClient;
    }

    public async Task Handle(FileDeletedEvent message, IMessageHandlerContext context)
    {
        try
        {
            _logger.LogInformation("File delete event received for {fileGuid}", message.Guid);
            await _qdrantClient.DeleteEmbeddingsByFileIdAsync(message.UserId.ToString(), message.Guid);

            _logger.LogInformation("File embedding successfully deleted for {fileGuid}", message.Guid);
        }
        catch (Exception ex)
        {
            _logger.LogError("File embeddings removal failed: {error}", ex.Message);
        }
    }
}
