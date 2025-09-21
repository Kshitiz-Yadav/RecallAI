namespace API.Services;

public interface IOpenAiEmbedder
{
    public Task<List<float>> EmbedTextAsync(string text, int userId);
}
