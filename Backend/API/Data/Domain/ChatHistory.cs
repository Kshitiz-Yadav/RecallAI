using API.Enums;

namespace API.Data.Domain;

public class ChatHistory
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime TimeStamp { get; set; }
    public ChatModel ChatModel { get; set; }
    public string? Question { get; set; }
    public string? Answer { get; set; }
}
