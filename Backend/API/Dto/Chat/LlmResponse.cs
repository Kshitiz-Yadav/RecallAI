using System.Text.Json.Serialization;

namespace API.Dto.Chat;

public class LlmResponse
{
    [JsonPropertyName("has_context")]
    public bool HasContext { get; set; }
    
    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }
    
    [JsonPropertyName("response")]
    public string Response { get; set; } = string.Empty;
}