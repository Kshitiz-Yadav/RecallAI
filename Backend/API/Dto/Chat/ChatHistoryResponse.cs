namespace API.Dto.Chat;

public class ChatHistoryResponse
{
    public DateTime TimeStamp { get; set; }
    public string? Question { get; set; }
    public string? Answer { get; set; }
}
