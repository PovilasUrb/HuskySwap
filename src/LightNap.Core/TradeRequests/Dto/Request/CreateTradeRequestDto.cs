namespace LightNap.Core.TradeRequests.Request.Dto
{
    public class CreateTradeRequestDto
    {
        // TODO: Update which fields to include when creating this item.
        public int RequestedClassId { get; set; }
		public int OfferedClassId { get; set; }
		public required string RequestingUserId { get; set; }
		public required string TargetUserId { get; set; }
		public required string Status { get; set; }
		public string? Notes { get; set; }
    }
}