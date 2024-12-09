
using LightNap.Core.Api;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;

namespace LightNap.Core.TradeRequests.Interfaces
{
    public interface ITradeRequestService
    {
        Task<TradeRequestDto?> GetTradeRequestAsync(int id);
        Task<PagedResponse<TradeRequestDto>> SearchTradeRequestsAsync(SearchTradeRequestsDto dto);
        Task<TradeRequestDto> CreateTradeRequestAsync(CreateTradeRequestDto dto);
        Task<TradeRequestDto> MakeATradeRequestAsync(CreateTradeRequestDto dto);
        Task<TradeRequestDto> UpdateTradeRequestAsync(int id, UpdateTradeRequestDto dto);
        Task<IList<TradeRequestDto>> GetMyTradeRequestsSentAsync();
        Task<IList<TradeRequestDto>> GetMyTradeRequestsReceivedAsync();
        Task CancelMyTradeRequestAsync(int id);
        Task CancelTradeRequestAsync(int id);
        Task RespondToMyTradeRequestAsync(int id, bool accept);
        Task RespondToTradeRequestAsync(int id, bool accept);
        Task DeleteTradeRequestAsync(int id);
        Task<ChatMessageDto> CreateChatMessageAsync(CreateChatMessageDto dto, int tradeRequestId);
        Task<IList<ChatMessageDto>> GetChatMessagesAsync(int tradeRequestId, int sinceMessageId);
    }
}
