
using LightNap.Core.Data.Entities;

namespace LightNap.Core.TradeRequests.Request.Dto
{
    public class CreateTradeRequestDto
    {
        // TODO: Update which fields to include when creating this item.
        public int RequestingClassUserId { get; set; }
        public int TargetClassUserId { get; set; }
        public required string Notes { get; set; }
    }
}