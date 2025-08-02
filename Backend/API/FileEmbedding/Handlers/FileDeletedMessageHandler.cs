using API.FileEmbedding.Messages;

namespace API.FileEmbedding.Handlers;

public class FileDeletedMessageHandler : IHandleMessages<FileDeletedMessage>
{
    public Task Handle(FileDeletedMessage message, IMessageHandlerContext context)
    {
        Console.WriteLine($"[FileDeletedHandler] File deleted: {message.Guid}");
        return Task.CompletedTask;
    }
}
