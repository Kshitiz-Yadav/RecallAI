namespace API.FilesManagement.FileEmbedding.Messages;

public class FileUploadedEvent : IEvent
{
    public required string Guid { get; set; }
}
