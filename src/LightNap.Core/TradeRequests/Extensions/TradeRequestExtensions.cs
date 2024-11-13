
using LightNap.Core.Data.Entities;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;

namespace LightNap.Core.TradeRequests.Extensions
{
    public static class TradeRequestExtensions
    {
        public static TradeRequest ToCreate(this CreateTradeRequestDto dto)
        {
            // TODO: Update these fields to match the DTO.
            var item = new TradeRequest
            {
                RequestingClassUserId = dto.RequestingClassUserId,
                TargetClassUserId = dto.TargetClassUserId,
                Status = TradeRequestStatus.Pending,
                Notes = dto.Notes
            };
            return item;
        }

        public static TradeRequestDto ToDto(this TradeRequest item)
        {
            // TODO: Update these fields to match the DTO.
            var dto = new TradeRequestDto
            {
                Id = item.Id,
                RequestingClassUserId = item.RequestingClassUserId,
                TargetClassUserId = item.TargetClassUserId,
                Status = item.Status,
                Notes = item.Notes
            };
            return dto;
        }

        public static void UpdateFromDto(this TradeRequest item, UpdateTradeRequestDto dto)
        {
            // TODO: Update these fields to match the DTO.
            item.Notes = dto.Notes;
        }
    }
}