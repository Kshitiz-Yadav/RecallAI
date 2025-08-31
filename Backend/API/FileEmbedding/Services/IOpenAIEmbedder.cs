namespace API.FileEmbedding.Services;

public interface IOpenAiEmbedder
{
    public Task<List<float>> EmbedTextAsync(string text);
}
