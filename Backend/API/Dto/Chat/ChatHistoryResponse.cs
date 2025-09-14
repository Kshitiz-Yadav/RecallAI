using API.Enums;

namespace API.Dto.Chat;

public class ChatHistoryResponse
{
    public DateTime TimeStamp { get; set; }
    public ChatModel ChatModel { get; set; }
    public string? Question { get; set; }
    public string? Answer { get; set; }
}
