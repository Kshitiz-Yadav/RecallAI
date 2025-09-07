using API.Enums;

namespace API.Dto.Chat;

public class AskQuestionRequest
{
    public required string Question { get; set; }
    public List<string> FileGuids { get; set; } = new List<string>();
    public int TopK { get; set; } = 5;
    public int MaxWords { get; set; } = 500;
    public ChatModel ChatModel { get; set; } = ChatModel.Gpt4oMini;
}
