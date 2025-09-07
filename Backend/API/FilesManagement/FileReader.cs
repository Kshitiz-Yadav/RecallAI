using System.Text;
using UglyToad.PdfPig;

namespace API.FilesManagement;

public static class FileReader
{
    public static async Task<string> ReadFile(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        string content = extension switch
        {
            ".txt" => await ReadTxtFile(file),
            ".pdf" => await ReadPdfFile(file),
            _ => throw new NotSupportedException($"File type {extension} is not supported.")
        };

        return content;
    }

    private static async Task<string> ReadTxtFile(IFormFile file)
    {
        using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8);
        return await reader.ReadToEndAsync();
    }

    private static async Task<string> ReadPdfFile(IFormFile file)
    {
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        memoryStream.Position = 0;

        var sb = new StringBuilder();
        using (var pdf = PdfDocument.Open(memoryStream))
        {
            foreach (var page in pdf.GetPages())
            {
                sb.AppendLine(page.Text);
            }
        }

        return sb.ToString();
    }
}
