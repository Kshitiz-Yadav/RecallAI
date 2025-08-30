using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace API.FileEmbedding.Services;

public class OpenAiEmbedder
{
    private readonly HttpClient _client;
    private readonly string _apiKey;
    private const string EmbeddingUrl = "https://api.openai.com/v1/embeddings";
    private const string EmbeddingModel = "text-embedding-3-small";

    public OpenAiEmbedder(string apiKey)
    {
        _client = new HttpClient();
        _apiKey = apiKey;
    }

    public async Task<List<float>> EmbedTextAsync(string text)
    {
        var payload = new
        {
            input = text,
            model = EmbeddingModel
        };

        var req = new HttpRequestMessage(HttpMethod.Post, EmbeddingUrl)
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        var res = await _client.SendAsync(req);
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadAsStringAsync();
        var parsed = JsonDocument.Parse(json);

        return parsed.RootElement
                     .GetProperty("data")[0]
                     .GetProperty("embedding")
                     .EnumerateArray()
                     .Select(x => x.GetSingle())
                     .ToList();
    }
}

