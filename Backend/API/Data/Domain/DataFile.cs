using System.ComponentModel.DataAnnotations;

namespace API.Data.Domain;

public class DataFile
{
    [Key]
    public required string Guid { get; set; }
    public required string Name { get; set; }
    public required string RawContent { get; set; }
    public DateTime UploadDate { get; set; }
    public long Size { get; set; }
    public int UserId { get; set; }
}
