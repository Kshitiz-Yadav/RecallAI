using System.Net;

namespace API.Dto;

public class ApiResponse
{
    public HttpStatusCode StatusCode { get; set; }
    public string? Message { get; set; }
    public object? Object { get; set; }
}
