using System.Text.Json.Serialization;

namespace API.Dto.Chat;

public class OpenAiChatOutputItem
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("object")]
    public string? Object { get; set; }

    [JsonPropertyName("content")]
    public List<OpenAiChatOutputItemContent> Content { get; set; } = new();
}
