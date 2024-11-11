using LightNap.Core.Api;
using LightNap.Core.ClassInfos.Interfaces;
using LightNap.Core.ClassInfos.Request.Dto;
using LightNap.Core.ClassInfos.Response.Dto;
using Microsoft.AspNetCore.Mvc;

namespace LightNap.WebApi.Controllers
{
    // TODO: Update authorization for methods via the Authorize attribute at the controller or method level.
    // Also register this controller's dependencies in the AddApplicationServices method of Extensions/ApplicationServiceExtensions.cs:
    //
    // services.AddScoped<IClassInfoService, ClassInfoService>();
    //
    [ApiController]
    [Route("api/[controller]")]
    public class ClassInfosController(IClassInfoService classInfosService) : ControllerBase
    {
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassInfoDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassInfoDto>>> GetClassInfo(int id)
        {
            return await classInfosService.GetClassInfoAsync(id);
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(ApiResponseDto<PagedResponse<ClassInfoDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<PagedResponse<ClassInfoDto>>>> SearchClassInfos([FromBody] SearchClassInfosDto dto)
        {
            return await classInfosService.SearchClassInfosAsync(dto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponseDto<ClassInfoDto>), 201)]
        public async Task<ActionResult<ApiResponseDto<ClassInfoDto>>> CreateClassInfo([FromBody] CreateClassInfoDto dto)
        {
            return await classInfosService.CreateClassInfoAsync(dto);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassInfoDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassInfoDto>>> UpdateClassInfo(int id, [FromBody] UpdateClassInfoDto dto)
        {
            return await classInfosService.UpdateClassInfoAsync(id, dto);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> DeleteClassInfo(int id)
        {
            return await classInfosService.DeleteClassInfoAsync(id);
        }
    }
}