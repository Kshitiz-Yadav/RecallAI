using API.Dto.Qdrant;
using System.Text;
using System.Text.Json;

namespace API.FileEmbedding.Services;

public class QdrantClient : IQdrantClient
{
    private readonly HttpClient _httpClient = new();
    private readonly string _qdrantUrl;
    private readonly ILogger<QdrantClient> _logger;
    public QdrantClient(AppSettings appSettings, ILogger<QdrantClient> logger)
    {
        _qdrantUrl = appSettings.QdrantUrl;
        _logger = logger;
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

    public async Task DeleteEmbeddingsByFileIdAsync(string collectionName, string fileId)
    {
        var existingCollection = await _httpClient.GetAsync($"{_qdrantUrl}/collections/{collectionName}");
        if (!existingCollection.IsSuccessStatusCode)
        {
            return;
        }

        var payload = new
        {
            filter = new
            {
                @must = new[]
                {
                    new { key = "fileGuid", match = new { value = fileId } }
                }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, $"{_qdrantUrl}/collections/{collectionName}/points/delete")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

}
