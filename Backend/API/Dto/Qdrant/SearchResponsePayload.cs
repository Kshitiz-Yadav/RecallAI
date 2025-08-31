using System.Text.Json.Serialization;

namespace API.Dto.Qdrant;

public class SearchResponsePayload
{
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    [JsonPropertyName("fileGuid")]
    public string FileGuid { get; set; } = string.Empty;

    [JsonPropertyName("userId")]
    public int UserId { get; set; }
}
