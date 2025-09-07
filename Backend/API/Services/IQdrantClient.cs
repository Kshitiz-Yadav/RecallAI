using API.Dto.Qdrant;

namespace API.Services;

public interface IQdrantClient
{
    public Task CreateCollectionIfNotExistsAsync(string collectionName);
    public Task UpsertChunkAsync(string collection, string chunkId, List<float> vector, Dictionary<string, object> payload);
    public Task DeleteEmbeddingsByFileIdAsync(string collectionName, string fileId);
    public Task<List<SearchResult>> SearchAsync(string collectionName, List<string> fileGuids, List<float> queryVector, int topK);
}
