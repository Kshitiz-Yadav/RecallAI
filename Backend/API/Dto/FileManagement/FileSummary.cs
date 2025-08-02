using API.Enums;

namespace API.Dto.FileManagement;

public class FileSummary
{
    public required string Guid { get; set; }
    public required string Name { get; set; }
    public DateTime UploadDate { get; set; }
    public long Size { get; set; }
    public FileStatus Status { get; set; }
}
