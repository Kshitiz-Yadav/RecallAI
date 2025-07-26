using System.ComponentModel.DataAnnotations;

namespace API.Data.Domain;

public class UserLimits
{
    [Key]
    public int UserId { get; set; }
    public long MaxStorage { get; set; }
    public long UsedStorage { get; set; }
}
