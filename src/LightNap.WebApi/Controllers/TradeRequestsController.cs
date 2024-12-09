
using LightNap.Core.Api;
using LightNap.Core.TradeRequests.Interfaces;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;
using LightNap.WebApi.Api;
using LightNap.WebApi.Configuration;
using Microsoft.AspNetCore.Authorization;
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
            return new ApiResponseDto<TradeRequestDto>(await tradeRequestsService.GetTradeRequestAsync(id));
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(ApiResponseDto<PagedResponse<TradeRequestDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<PagedResponse<TradeRequestDto>>>> SearchTradeRequests([FromBody] SearchTradeRequestsDto dto)
        {
            return new ApiResponseDto<PagedResponse<TradeRequestDto>>(await tradeRequestsService.SearchTradeRequestsAsync(dto));
        }

        [Authorize(Policy = Policies.RequireAdministratorRole)]
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponseDto<TradeRequestDto>), 201)]
        public async Task<ActionResult<ApiResponseDto<TradeRequestDto>>> CreateTradeRequest([FromBody] CreateTradeRequestDto dto)
        {
            return new ApiResponseDto<TradeRequestDto>(await tradeRequestsService.CreateTradeRequestAsync(dto));
        }

        [HttpPost("my-trades")]
        [ProducesResponseType(typeof(ApiResponseDto<TradeRequestDto>), 201)]
        public async Task<ActionResult<ApiResponseDto<TradeRequestDto>>> MakeATradeRequest([FromBody] CreateTradeRequestDto dto)
        {
            return new ApiResponseDto<TradeRequestDto>(await tradeRequestsService.MakeATradeRequestAsync(dto));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<TradeRequestDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<TradeRequestDto>>> UpdateTradeRequest(int id, [FromBody] UpdateTradeRequestDto dto)
        {
            return new ApiResponseDto<TradeRequestDto>(await tradeRequestsService.UpdateTradeRequestAsync(id, dto));
        }

        [HttpPost("{id}/cancel")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> CancelMyTradeRequest(int id)
        {
            await tradeRequestsService.CancelMyTradeRequestAsync(id);
            return new ApiResponseDto<bool>(true);
        }

        [HttpPost("{id}/accept")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> AcceptMyTradeRequest(int id)
        {
            await tradeRequestsService.RespondToMyTradeRequestAsync(id, true);
            return new ApiResponseDto<bool>(true);
        }

        [HttpPost("{id}/reject")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> RejectMyTradeRequest(int id)
        {
            await tradeRequestsService.RespondToMyTradeRequestAsync(id, false);
            return new ApiResponseDto<bool>(true);
        }

        [HttpGet("sent")]
        [ProducesResponseType(typeof(ApiResponseDto<IList<TradeRequestDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<IList<TradeRequestDto>>>> GetMyTradeRequestsSent()
        {
            return new ApiResponseDto<IList<TradeRequestDto>>(await tradeRequestsService.GetMyTradeRequestsSentAsync());
        }

        [HttpGet("received")]
        [ProducesResponseType(typeof(ApiResponseDto<IList<TradeRequestDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<IList<TradeRequestDto>>>> GetMyTradeRequestsReceived()
        {
            return new ApiResponseDto<IList<TradeRequestDto>>(await tradeRequestsService.GetMyTradeRequestsReceivedAsync());
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> DeleteTradeRequest(int id)
        {
            await tradeRequestsService.DeleteTradeRequestAsync(id);
            return new ApiResponseDto<bool>(true);
        }

        [HttpPost("{id}/chat")]
        [ProducesResponseType(typeof(ApiResponseDto<ChatMessageDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ChatMessageDto>>> CreateChatMessage(CreateChatMessageDto dto, int id)
        {
            return new ApiResponseDto<ChatMessageDto>(await tradeRequestsService.CreateChatMessageAsync(dto, id));
        }

        [HttpGet("{id}/chat/{sinceMessageId?}")]
        [ProducesResponseType(typeof(ApiResponseDto<IList<ChatMessageDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<IList<ChatMessageDto>>>> GetChatMessages(int id, int sinceMessageId = 0)
        {
            return new ApiResponseDto<IList<ChatMessageDto>>(await tradeRequestsService.GetChatMessagesAsync(id, sinceMessageId));
        }
    }
}
