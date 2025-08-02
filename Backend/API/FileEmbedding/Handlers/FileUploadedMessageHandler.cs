using API.FileEmbedding.Messages;

namespace API.FileEmbedding.Handlers;

public class FileUploadedMessageHandler : IHandleMessages<FileUploadedMessage>
{
    public Task Handle(FileUploadedMessage message, IMessageHandlerContext context)
    {
        Console.WriteLine($"[FileAddedHandler] File added: {message.Guid}");
        return Task.CompletedTask;
    }
}
