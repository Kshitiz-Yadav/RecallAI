using System.Text.Json.Serialization;

namespace API.Dto.Qdrant;

public class SearchResponsePointsList
{
    [JsonPropertyName("points")]
    public List<SearchResponsePoint>? Points { get; set; }
}
