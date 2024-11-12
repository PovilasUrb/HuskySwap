
using LightNap.Core.Data.Entities;

namespace LightNap.Core.TradeRequests.Request.Dto
{
    public class UpdateTradeRequestDto
    {
        // TODO: Update which fields to include when creating this item.
        public int RequestingClassUserId { get; set; }
        public int TargetClassUserId { get; set; }
        public TradeRequestStatus Status { get; set; }
        public string Notes { get; set; }
    }
}