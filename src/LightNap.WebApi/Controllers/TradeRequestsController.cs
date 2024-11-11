
using LightNap.Core.Api;
using LightNap.Core.TradeRequests.Interfaces;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;
using Microsoft.AspNetCore.Mvc;

namespace LightNap.WebApi.Controllers
{
    // TODO: Update authorization for methods via the Authorize attribute at the controller or method level.
    // Also register this controller's dependencies in the AddApplicationServices method of Extensions/ApplicationServiceExtensions.cs:
    //
    // services.AddScoped<ITradeRequestService, TradeRequestService>();
    //
    [ApiController]
    [Route("api/[controller]")]
    public class TradeRequestsController(ITradeRequestService tradeRequestsService) : ControllerBase
    {
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<TradeRequestDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<TradeRequestDto>>> GetTradeRequest(int id)
        {
            return await tradeRequestsService.GetTradeRequestAsync(id);
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(ApiResponseDto<PagedResponse<TradeRequestDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<PagedResponse<TradeRequestDto>>>> SearchTradeRequests([FromBody] SearchTradeRequestsDto dto)
        {
            return await tradeRequestsService.SearchTradeRequestsAsync(dto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponseDto<TradeRequestDto>), 201)]
        public async Task<ActionResult<ApiResponseDto<TradeRequestDto>>> CreateTradeRequest([FromBody] CreateTradeRequestDto dto)
        {
            return await tradeRequestsService.CreateTradeRequestAsync(dto);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<TradeRequestDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<TradeRequestDto>>> UpdateTradeRequest(int id, [FromBody] UpdateTradeRequestDto dto)
        {
            return await tradeRequestsService.UpdateTradeRequestAsync(id, dto);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> DeleteTradeRequest(int id)
        {
            return await tradeRequestsService.DeleteTradeRequestAsync(id);
        }
    }
}
