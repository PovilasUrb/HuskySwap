
using LightNap.Core.Api;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;

namespace LightNap.Core.TradeRequests.Interfaces
{
    public interface ITradeRequestService
    {
        Task<ApiResponseDto<TradeRequestDto>> GetTradeRequestAsync(int id);
        Task<ApiResponseDto<PagedResponse<TradeRequestDto>>> SearchTradeRequestsAsync(SearchTradeRequestsDto dto);
        Task<ApiResponseDto<TradeRequestDto>> CreateTradeRequestAsync(CreateTradeRequestDto dto);
        Task<ApiResponseDto<TradeRequestDto>> MakeATradeRequestAsync(CreateTradeRequestDto dto);
        Task<ApiResponseDto<TradeRequestDto>> UpdateTradeRequestAsync(int id, UpdateTradeRequestDto dto);
        Task<ApiResponseDto<IList<TradeRequestDto>>> GetMyTradeRequestsSentAsync();
        Task<ApiResponseDto<IList<TradeRequestDto>>> GetMyTradeRequestsReceivedAsync();
        Task<ApiResponseDto<bool>> CancelMyTradeRequestAsync(int id);
        Task<ApiResponseDto<bool>> CancelTradeRequestAsync(int id);
        Task<ApiResponseDto<bool>> RespondToMyTradeRequestAsync(int id, bool accept);
        Task<ApiResponseDto<bool>> RespondToTradeRequestAsync(int id, bool accept);
        Task<ApiResponseDto<bool>> DeleteTradeRequestAsync(int id);
        Task<ApiResponseDto<ChatMessageDto>> CreateChatMessageAsync(CreateChatMessageDto dto, int tradeRequestId);
        Task<ApiResponseDto<IList<ChatMessageDto>>> GetChatMessagesAsync(int tradeRequestId, int sinceMessageId);
    }
}
