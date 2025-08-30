using API.Data;
using API.Dto.FileEmbedding;
using API.Enums;
using API.FileEmbedding.Messages;
using API.FileEmbedding.Services;
using Microsoft.EntityFrameworkCore;

namespace API.FileEmbedding.Handlers;

public class FileUploadedEventHandler : IHandleMessages<FileUploadedEvent>
{
    private readonly DatabaseContext _dbContext;
    private readonly ILogger<FileUploadedEventHandler> _logger;
    private readonly AppSettings _appSettings;

    public FileUploadedEventHandler(DatabaseContext dbContext, ILogger<FileUploadedEventHandler> logger, AppSettings appSettings)
    {
        _dbContext = dbContext;
        _logger = logger;
        _appSettings = appSettings;
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

            var embedder = new OpenAiEmbedder(_appSettings.OpenAiKey);
            var qdrantClient = new QdrantClient(_appSettings.QdrantUrl);
            await qdrantClient.CreateCollectionIfNotExistsAsync(file.UserId.ToString());

            var chunks = TextChunker.ChunkText(file.RawContent);
            foreach (var chunk in chunks)
            {
                var embedding = await embedder.EmbedTextAsync(chunk.Text);
                await qdrantClient.UpsertChunkAsync(file.UserId.ToString(), chunk.ChunkId, embedding, new Dictionary<string, object>
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
