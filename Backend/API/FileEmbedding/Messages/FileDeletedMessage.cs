namespace API.FileEmbedding.Messages;

public class FileDeletedMessage : IEvent
{
    public required string Guid { get; set; }
}
