using System.Text;
using System.Text.Json;

namespace API.FileEmbedding.Services;

public class QdrantClient
{
    private readonly HttpClient _httpClient = new();
    private readonly string _qdrantUrl;

    public QdrantClient(string qdrantUrl)
    {
        _qdrantUrl = qdrantUrl;
    }

    public async Task CreateCollectionIfNotExistsAsync(string collectionName)
    {
        var existingCollection = await _httpClient.GetAsync($"{_qdrantUrl}/collections/{collectionName}");
        if (existingCollection.IsSuccessStatusCode)
        {
            return;
        }

        var body = new
        {
            vectors = new { size = 1536, distance = "Cosine" }
        };

        var res = await _httpClient.PutAsync(
            $"{_qdrantUrl}/collections/{collectionName}",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
        );

        res.EnsureSuccessStatusCode();
    }

    public async Task UpsertChunkAsync(string collection, string chunkId, List<float> vector, Dictionary<string, object> payload)
    {
        var point = new
        {
            points = new[]
            {
                new { id = chunkId, vector, payload }
            }
        };

        var res = await _httpClient.PutAsync(
            $"{_qdrantUrl}/collections/{collection}/points",
            new StringContent(JsonSerializer.Serialize(point), Encoding.UTF8, "application/json")
        );

        res.EnsureSuccessStatusCode();
    }
}
