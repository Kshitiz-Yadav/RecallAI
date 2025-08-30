namespace API.Dto.FileEmbedding;

public class TextChunk
{
    public string ChunkId { get; set; } = Guid.NewGuid().ToString();
    public required string Text { get; set; }
}
