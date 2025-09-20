namespace API.Enums;

// The assigned values allow direct mapping with 'Resources'
public enum ChatModel
{
    Gpt4oMini = 2,
    Gpt4o = 3,
    Gpt41Mini = 4,
    Gpt41 = 5,
    Gpt5Mini = 6,
    Gpt5 = 7
}

public static class ChatModelExtensions
{
    public static string ToModelString(this ChatModel model)
    {
        return model switch
        {
            ChatModel.Gpt4oMini => "gpt-4o-mini",
            ChatModel.Gpt4o => "gpt-4o",
            ChatModel.Gpt41Mini => "gpt-4.1-mini",
            ChatModel.Gpt41 => "gpt-4.1",
            ChatModel.Gpt5Mini => "gpt-5-mini",
            ChatModel.Gpt5 => "gpt-5",
            _ => throw new ArgumentOutOfRangeException(nameof(model), model, "Unsupported ChatModel value")
        };
    }
}