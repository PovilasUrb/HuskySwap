
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
        Task<ApiResponseDto<TradeRequestDto>> UpdateTradeRequestAsync(int id, UpdateTradeRequestDto dto);
        Task<ApiResponseDto<bool>> DeleteTradeRequestAsync(int id);
    }
}
