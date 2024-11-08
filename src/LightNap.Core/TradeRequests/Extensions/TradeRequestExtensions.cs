using LightNap.Core.Data.Entities;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;

namespace LightNap.Core.TradeRequests.Extensions
{
    public static class TradeRequestExtensions
    {
        public static TradeRequestDto ToDto(this TradeRequest item)
        {
            // TODO: Update these fields to match the DTO.
            return new TradeRequestDto() {
                Id = item.Id,
                RequestedClassId = item.RequestedClassId,
                OfferedClassId = item.OfferedClassId,
                RequestingUserId = item.RequestingUserId,
                TargetUserId = item.TargetUserId,
                Status = item.Status,
                Notes = item.Notes
            };
        }

        public static void UpdateFromDto(this TradeRequest item, UpdateTradeRequestDto dto)
        {
            // TODO: Update these fields to match the DTO.
            item.RequestedClassId = dto.RequestedClassId;
			item.OfferedClassId = dto.OfferedClassId;
			item.RequestingUserId = dto.RequestingUserId;
			item.TargetUserId = dto.TargetUserId;
			item.Status = dto.Status;
			item.Notes = dto.Notes;
        }
    }
}