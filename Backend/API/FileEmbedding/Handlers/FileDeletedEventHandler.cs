using API.FileEmbedding.Messages;

namespace API.FileEmbedding.Handlers;

public class FileDeletedEventHandler : IHandleMessages<FileDeletedEvent>
{
    public Task Handle(FileDeletedEvent message, IMessageHandlerContext context)
    {
        Console.WriteLine($"[FileDeletedHandler] File deleted: {message.Guid}");
        return Task.CompletedTask;
    }
}
