namespace API.FilesManagement;

public static class FileValidator
{

    private const long MaxFileSize = 2 * 1024 * 1024; // 5 MB

    public static List<string> ValidateFile(IFormFile file)
    {
        var errors = new List<string>();
        if (file == null || file.Length == 0)
        {
            errors.Add("No file uploaded");
            return errors;
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".txt")
        {
            errors.Add("Only .txt files are allowed");
        }

        if (file.ContentType != "text/plain")
        {
            errors.Add("Invalid content type");
        }

        if (string.IsNullOrWhiteSpace(file.FileName))
        {
            errors.Add("File must have a name");
        }

        if (file.Length > MaxFileSize)
        {
            errors.Add("File size exceeds 5 MB limit.");
        }

        return errors;
    }
}
