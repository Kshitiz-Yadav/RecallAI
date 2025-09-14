namespace API.Enums;

public enum ChatModel
{
    Gpt4oMini,
    Gpt4o,
    Gpt41Mini,
    Gpt41,
    Gpt5Mini,
    Gpt5
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