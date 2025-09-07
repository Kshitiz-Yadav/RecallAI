using System.Text.Json.Serialization;

namespace API.Dto.Chat;

public class OpenAiChatOutputItemContent
{
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("text")]
    public string? Text { get; set; }
}
