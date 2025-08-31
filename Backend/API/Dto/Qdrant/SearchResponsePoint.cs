using System.Text.Json.Serialization;

namespace API.Dto.Qdrant;

public class SearchResponsePoint
{
    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("version")]
    public long Version { get; set; }

    [JsonPropertyName("score")]
    public float Score { get; set; }

    [JsonPropertyName("payload")]
    public SearchResponsePayload? Payload { get; set; }
}
