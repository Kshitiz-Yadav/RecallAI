using API.Dto.FileEmbedding;

namespace API.Services;

public static class TextChunker
{
    public static List<TextChunk> ChunkText(string text, int chunkSize = 300, int overlap = 50)
    {
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var chunks = new List<TextChunk>();

        for (int i = 0; i < words.Length; i += chunkSize - overlap)
        {
            var chunkWords = words.Skip(i).Take(chunkSize).ToArray();
            if (chunkWords.Length < overlap)
            {
                break;
            }

            chunks.Add(new TextChunk { Text = string.Join(' ', chunkWords) });
        }

        return chunks;
    }
}
