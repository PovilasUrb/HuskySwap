
using LightNap.Core.Api;
using LightNap.Core.ClassUsers.Interfaces;
using LightNap.Core.ClassUsers.Request.Dto;
using LightNap.Core.ClassUsers.Response.Dto;
using Microsoft.AspNetCore.Mvc;

namespace LightNap.WebApi.Controllers
{
    // TODO: Update authorization for methods via the Authorize attribute at the controller or method level.
    // Also register this controller's dependencies in the AddApplicationServices method of Extensions/ApplicationServiceExtensions.cs:
    //
    // services.AddScoped<IClassUserService, ClassUserService>();
    //
    [ApiController]
    [Route("api/[controller]")]
    public class ClassUsersController(IClassUserService classUsersService) : ControllerBase
    {
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassUserDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassUserDto>>> GetClassUser(int id)
        {
            return await classUsersService.GetClassUserAsync(id);
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(ApiResponseDto<PagedResponse<ClassUserDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<PagedResponse<ClassUserDto>>>> SearchClassUsers([FromBody] SearchClassUsersDto dto)
        {
            return await classUsersService.SearchClassUsersAsync(dto);
        }

        [HttpGet("my-classes")]
        [ProducesResponseType(typeof(ApiResponseDto<IList<ClassUserDto>>), 200)]
        public async Task<ActionResult<ApiResponseDto<IList<ClassUserDto>>>> GetMyClasses()
        {
            return await classUsersService.GetMyClassesAsync();
        }

        [HttpDelete("my-classes/{classId}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> RemoveMeFromClass(string classId)
        {
            return await classUsersService.RemoveMeFromClassAsync(classId);
        }

        [HttpPost("my-classes/{classId}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassUserDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassUserDto>>> AddMeToClass(string classId)
        {
            return await classUsersService.AddMeToClassAsync(classId);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponseDto<ClassUserDto>), 201)]
        public async Task<ActionResult<ApiResponseDto<ClassUserDto>>> CreateClassUser([FromBody] CreateClassUserDto dto)
        {
            return await classUsersService.CreateClassUserAsync(dto);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<ClassUserDto>), 200)]
        public async Task<ActionResult<ApiResponseDto<ClassUserDto>>> UpdateClassUser(int id, [FromBody] UpdateClassUserDto dto)
        {
            return await classUsersService.UpdateClassUserAsync(id, dto);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ActionResult<ApiResponseDto<bool>>> DeleteClassUser(int id)
        {
            return await classUsersService.DeleteClassUserAsync(id);
        }
    }
}
