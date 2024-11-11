
using LightNap.Core.Api;
using LightNap.Core.Data.Entities;

namespace LightNap.Core.TradeRequests.Request.Dto
{
    public class SearchTradeRequestsDto : PaginationRequestDtoBase
    {
        // TODO: Update to reflect which fields to include for searches.
        public int? RequestingClassUserId { get; set; }
        public int? TargetClassUserId { get; set; }
        public TradeRequestStatus? Status { get; set; }
        public string? Notes { get; set; }

    }
}