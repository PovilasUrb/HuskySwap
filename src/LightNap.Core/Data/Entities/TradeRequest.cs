namespace LightNap.Core.Data.Entities
{
    public class TradeRequest
    {
        public int Id { get; set; }
        public required ClassInfo RequestedClass { get; set; }
        public required int RequestedClassId { get; set; }
        public required ClassInfo OfferedClass { get; set; }
        public required int OfferedClassId { get; set; }
        public required ApplicationUser RequestingUser { get; set; }
        public required string RequestingUserId { get; set; }
        public required ApplicationUser TargetUser { get; set; }
        public required string TargetUserId { get; set; }
        public required string Status { get; set; }
        public string? Notes { get; set; }
    }
}
