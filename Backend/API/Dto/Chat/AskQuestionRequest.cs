namespace API.Dto.Chat;

public class AskQuestionRequest
{
    public required string Question { get; set; }
    public List<string> FileGuids { get; set; } = new List<string>();
    public int TopK { get; set; } = 5;
}
