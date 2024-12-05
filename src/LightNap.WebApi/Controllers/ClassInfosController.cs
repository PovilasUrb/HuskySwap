
using LightNap.Core.Api;
using LightNap.Core.ClassInfos.Interfaces;
using LightNap.Core.ClassInfos.Request.Dto;
using LightNap.Core.ClassInfos.Response.Dto;
using LightNap.WebApi.Configuration;
using Microsoft.AspNetCore.Authorization;
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
        public async Task<ActionResult<ApiResponseDto<ClassInfoDto>>> GetClassInfo(string id)
        {
            return await classInfosService.GetClassInfoAsync(id);
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(ApiResponseDto<PagedResponse<ClassInfoDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<PagedResponse<ClassInfoDto>>>> SearchClassInfos([FromBody] SearchClassInfosDto dto)
        {
            return await classInfosService.SearchClassInfosAsync(dto);
        }

        [Authorize(Policy = Policies.RequireAdministratorRole)]
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponseDto<ClassInfoDto>), 201)]
        public async Task<ActionResult<ApiResponseDto<ClassInfoDto>>> CreateClassInfo([FromBody] CreateClassInfoDto dto)
        {
            return await classInfosService.CreateClassInfoAsync(dto);
        }

        [Authorize(Policy = Policies.RequireAdministratorRole)]
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassInfoDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassInfoDto>>> UpdateClassInfo(string id, [FromBody] UpdateClassInfoDto dto)
        {
            return await classInfosService.UpdateClassInfoAsync(id, dto);
        }

        [Authorize(Policy = Policies.RequireAdministratorRole)]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> DeleteClassInfo(string id)
        {
            return await classInfosService.DeleteClassInfoAsync(id);
        }
    }
}
