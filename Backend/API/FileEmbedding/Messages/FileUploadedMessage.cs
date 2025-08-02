namespace API.FileEmbedding.Messages;

public class FileUploadedMessage : IEvent
{
    public required string Guid { get; set; }
}
