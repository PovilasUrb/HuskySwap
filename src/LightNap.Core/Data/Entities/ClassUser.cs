namespace LightNap.Core.Data.Entities
{
    public class ClassUser
    {
        public int Id { get; set; }
        public ClassInfo? Class { get; set; }
        public required int ClassId { get; set; }
        public ApplicationUser? User { get; set; }
        public required string UserId { get; set; }
        public bool IsActive {  get; set; }
    }
}
