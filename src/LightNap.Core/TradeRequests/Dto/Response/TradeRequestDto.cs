
using LightNap.Core.Data.Entities;

namespace LightNap.Core.TradeRequests.Response.Dto
{
    public class TradeRequestDto
    {
        // TODO: Finalize which fields to include when returning this item.
		public int Id { get; set; }
        public int RequestingClassUserId { get; set; }
        public int TargetClassUserId { get; set; }
        public TradeRequestStatus Status { get; set; }
        public required string Notes { get; set; }
    }
}
