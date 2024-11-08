namespace LightNap.Core.TradeRequests.Response.Dto
{
    public class TradeRequestDto
    {
        // TODO: Finalize which fields to include when returning this item.
        public int Id { get; set; }
        public int RequestedClassId { get; set; }
		public int OfferedClassId { get; set; }
		public required string RequestingUserId { get; set; }
		public required string TargetUserId { get; set; }
		public required string Status { get; set; }
		public string? Notes { get; set; }
    }
}