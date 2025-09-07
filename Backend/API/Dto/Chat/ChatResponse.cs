using System.Net;

namespace API.Dto.Chat;

public class ChatResponse
{
    public bool IsSuccessful { get; set; }
    public HttpStatusCode StatusCode { get; set; }
    public string Response { get; set; } = string.Empty;
}
