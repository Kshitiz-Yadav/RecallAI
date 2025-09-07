using System.Text.Json.Serialization;

namespace API.Dto.Chat;

public class OpenAiChatResponse
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("object")]
    public string? Object { get; set; }

    [JsonPropertyName("model")]
    public string? Model { get; set; }

    [JsonPropertyName("created")]
    public long Created { get; set; }

    [JsonPropertyName("output_text")]
    public string? OutputText { get; set; }

    [JsonPropertyName("output")]
    public List<OpenAiChatOutputItem> Output { get; set; } = new();
}
