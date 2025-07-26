using System.ComponentModel.DataAnnotations;

namespace API.Data.Domain;

public class UserLimits
{
    [Key]
    public int UserId { get; set; }
    public int MaxStorage { get; set; }
    public int UsedStorage { get; set; }
}
