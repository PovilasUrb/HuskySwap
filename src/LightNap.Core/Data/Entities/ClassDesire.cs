namespace LightNap.Core.Data.Entities
{
    public class ClassDesire
    {
        public int Id { get; set; }
        public ClassInfo? ClassInfo { get; set; }
        public required string ClassInfoId { get; set; }
        public ApplicationUser? User { get; set; }
        public required string UserId { get; set; }
        public bool IsActive {  get; set; }
    }
}
