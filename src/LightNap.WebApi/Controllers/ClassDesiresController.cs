using LightNap.Core.Api;
using LightNap.Core.ClassDesires.Interfaces;
using LightNap.Core.ClassDesires.Request.Dto;
using LightNap.Core.ClassDesires.Response.Dto;
using LightNap.WebApi.Api;
using Microsoft.AspNetCore.Mvc;

namespace LightNap.WebApi.Controllers
{
    // TODO: Update authorization for methods via the Authorize attribute at the controller or method level.
    // Also register this controller's dependencies in the AddApplicationServices method of Extensions/ApplicationServiceExtensions.cs:
    //
    // services.AddScoped<IClassDesireService, ClassDesireService>();
    //
    [ApiController]
    [Route("api/[controller]")]
    public class ClassDesiresController(IClassDesireService classDesiresService) : ControllerBase
    {
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassDesireDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassDesireDto>>> GetClassDesire(int id)
        {
            return new ApiResponseDto<ClassDesireDto>(await classDesiresService.GetClassDesireAsync(id));
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(ApiResponseDto<PagedResponse<ClassDesireDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<PagedResponse<ClassDesireDto>>>> SearchClassDesires([FromBody] SearchClassDesiresDto dto)
        {
            return new ApiResponseDto<PagedResponse<ClassDesireDto>>(await classDesiresService.SearchClassDesiresAsync(dto));
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponseDto<ClassDesireDto>), 201)]
        public async Task<ActionResult<ApiResponseDto<ClassDesireDto>>> CreateClassDesire([FromBody] CreateClassDesireDto dto)
        {
            return new ApiResponseDto<ClassDesireDto>(await classDesiresService.CreateClassDesireAsync(dto));
        }

        [HttpGet("my-classes")]
        [ProducesResponseType(typeof(ApiResponseDto<IList<ClassDesireDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<IList<ClassDesireDto>>>> GetMyClasses()
        {
            return new ApiResponseDto<IList<ClassDesireDto>>(await classDesiresService.GetMyClassesAsync());
        }

        [HttpDelete("my-classes/{classId}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> RemoveMeFromClass(string classId)
        {
            await classDesiresService.RemoveMeFromClassAsync(classId);
            return new ApiResponseDto<bool>(true);
        }

        [HttpPost("my-classes/{classId}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassDesireDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassDesireDto>>> AddMeToClass(string classId)
        {
            return new ApiResponseDto<ClassDesireDto>(await classDesiresService.AddMeToClassAsync(classId));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassDesireDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassDesireDto>>> UpdateClassDesire(int id, [FromBody] UpdateClassDesireDto dto)
        {
            return new ApiResponseDto<ClassDesireDto>(await classDesiresService.UpdateClassDesireAsync(id, dto));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> DeleteClassDesire(int id)
        {
            await classDesiresService.DeleteClassDesireAsync(id);
            return new ApiResponseDto<bool>(true);
        }
    }
}