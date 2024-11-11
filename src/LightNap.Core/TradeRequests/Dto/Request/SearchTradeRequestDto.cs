using LightNap.Core.Api;

namespace LightNap.Core.TradeRequests.Request.Dto
{
    public class SearchTradeRequestsDto : PaginationRequestDtoBase
    {
        // TODO: Update to reflect which fields to include for searches.
        public int? RequestedClassId { get; set; }
		public int? OfferedClassId { get; set; }
		public string? RequestingUserId { get; set; }
		public string? TargetUserId { get; set; }
		public string? Status { get; set; }
		public string? Notes { get; set; }
    }
}
