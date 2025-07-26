namespace API.Dto.FileManagement;

public class FileUploadRequest
{
    public required IFormFile File { get; set; }
}
