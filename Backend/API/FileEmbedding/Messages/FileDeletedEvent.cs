namespace API.FileEmbedding.Messages;

public class FileDeletedEvent : IEvent
{
    public required string Guid { get; set; }
}
