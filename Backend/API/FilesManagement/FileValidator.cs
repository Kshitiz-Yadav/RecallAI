namespace API.FilesManagement;

public static class FileValidator
{

    private const long MaxFileSize = 3 * 1024 * 1024; // 3 MB
    private static readonly List<string> AllowedFileExtensions = [".txt", ".pdf"];
    private static readonly List<string> AllowedContentTypes = ["text/plain", "application/pdf", "application/x-pdf", "application/octet-stream"];

    public static List<string> ValidateFile(IFormFile file)
    {
        var errors = new List<string>();
        if (file == null || file.Length == 0)
        {
            errors.Add("No file uploaded");
            return errors;
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedFileExtensions.Contains(extension))
        {
            errors.Add($"Only {string.Join(", ", AllowedFileExtensions)} files are allowed");
        }

        if (!AllowedContentTypes.Contains(file.ContentType))
        {
            errors.Add($"Only {string.Join(", ", AllowedContentTypes)} content types are allowed");
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
