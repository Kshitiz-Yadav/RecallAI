using API.Data;
using API.Enums;
using API.FilesManagement.FileEmbedding.Messages;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.FilesManagement.FileEmbedding.Handlers;

public class FileUploadedEventHandler : IHandleMessages<FileUploadedEvent>
{
    private readonly DatabaseContext _dbContext;
    private readonly ILogger<FileUploadedEventHandler> _logger;
    private readonly IQdrantClient _qdrantClient;
    private readonly IOpenAiEmbedder _openAiEmbedder;

    public FileUploadedEventHandler(DatabaseContext dbContext, ILogger<FileUploadedEventHandler> logger, IQdrantClient qdrantClient, IOpenAiEmbedder openAiEmbedder)
    {
        _dbContext = dbContext;
        _logger = logger;
        _qdrantClient = qdrantClient;
        _openAiEmbedder = openAiEmbedder;
    }

    public async Task Handle(FileUploadedEvent message, IMessageHandlerContext context)
    {
        try
        {
            _logger.LogInformation("File upload event received for {fileGuid}", message.Guid);

            var file = await _dbContext.Files.FirstOrDefaultAsync(f => f.Guid == message.Guid, context.CancellationToken);
            if (file == null || file.Status != FileStatus.Uploaded)
            {
                _logger.LogError("File {fileGuid} not found or already processed.", message.Guid);
                return;
            }

            file.Status = FileStatus.Queued;
            await _dbContext.SaveChangesAsync(context.CancellationToken);

            await _qdrantClient.CreateCollectionIfNotExistsAsync(file.UserId.ToString());

            var chunks = TextChunker.ChunkText(file.RawContent);
            foreach (var chunk in chunks)
            {
                var embedding = await _openAiEmbedder.EmbedTextAsync(chunk.Text);
                await _qdrantClient.UpsertChunkAsync(file.UserId.ToString(), chunk.ChunkId, embedding, new Dictionary<string, object>
                {
                    ["userId"] = file.UserId,
                    ["fileGuid"] = file.Guid,
                    ["content"] = chunk.Text
                });
            }

            file.Status = FileStatus.Embedded;
            await _dbContext.SaveChangesAsync(context.CancellationToken);
            _logger.LogInformation("File embedding successfully completed for {fileGuid}", message.Guid);
        }
        catch (Exception ex)
        {
            _logger.LogError("File embedding failed: {error}",  ex.Message);
        }
    }
}
