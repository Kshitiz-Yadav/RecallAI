namespace API.FilesManagement.FileEmbedding.Messages;

public class FileDeletedEvent : IEvent
{
    public required string Guid { get; set; }
    public int UserId { get; set; }
}
