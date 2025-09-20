using API.Enums;

namespace API.Data.Domain;

public class Usage
{
    public int UserId { get; set; }
    public required string Month { get; set; }
    public Resource Resource { get; set; }
    public long Used { get; set; }
}
