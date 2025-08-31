using System.Text.Json.Serialization;

namespace API.Dto.Qdrant;

public class SearchResponse
{
    [JsonPropertyName("result")]
    public SearchResponsePointsList? Result { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("time")]
    public double Time { get; set; }
}
