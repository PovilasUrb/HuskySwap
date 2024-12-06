
using LightNap.Core.Data.Entities;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;

namespace LightNap.Core.TradeRequests.Extensions
{
    public static class ChatMessageExtensions
    {
        public static ChatMessage ToCreate(this CreateChatMessageDto dto, string userId, int tradeId)
        {
            // TODO: Update these fields to match the DTO.
            var item = new ChatMessage
            {
                Content = dto.Content,
                SendingUserId = userId,
                Timestamp = DateTime.UtcNow,
                TradeRequestId = tradeId
            };
            return item;
        }

        public static ChatMessageDto ToDto(this ChatMessage item)
        {
            // TODO: Update these fields to match the DTO.
            var dto = new ChatMessageDto
            {
                Id = item.Id,
                Content = item.Content,
                SendingUserId = item.SendingUserId,
                Timestamp = item.Timestamp
            };
            return dto;
        }
    }
}