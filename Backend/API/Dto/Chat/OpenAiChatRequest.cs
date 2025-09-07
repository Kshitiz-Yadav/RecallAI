using API.Enums;
using System.Text.Json.Serialization;

namespace API.Dto.Chat;

public class OpenAiChatRequest
{
    [JsonPropertyName("model")]
    public string? Model { get; set; }

    [JsonPropertyName("input")]
    public List<OpenAiChatInputItem> Input { get; set; } = new();

    [JsonPropertyName("max_output_tokens")]
    public int MaxOutputTokens { get; set; }
}
