using System.Text.Json.Serialization;

namespace API.Dto.Chat;

public class OpenAiChatUsageResponse
{
    [JsonPropertyName("input_tokens")]
    public long InputTokens { get; set; }
    [JsonPropertyName("output_tokens")]
    public long OutputTokens { get; set; }
}
