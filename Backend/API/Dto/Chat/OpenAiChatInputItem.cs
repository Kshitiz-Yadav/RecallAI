using System.Text.Json.Serialization;

namespace API.Dto.Chat;

public class OpenAiChatInputItem
{
    [JsonPropertyName("role")]
    public string? Role { get; set; }

    [JsonPropertyName("content")]
    public string? Content { get; set; }
}
