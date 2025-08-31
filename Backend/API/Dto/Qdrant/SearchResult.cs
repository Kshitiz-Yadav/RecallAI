namespace API.Dto.Qdrant;

public class SearchResult
{
    public string Content { get; set; } = string.Empty;
    public double Score { get; set; }
    public string FileGuid { get; set; } = string.Empty;
}
