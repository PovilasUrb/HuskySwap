
using LightNap.Core.Api;
using LightNap.Core.ClassUsers.Request.Dto;
using LightNap.Core.ClassUsers.Response.Dto;

namespace LightNap.Core.ClassUsers.Interfaces
{
    public interface IClassUserService
    {
        Task<ApiResponseDto<ClassUserDto>> GetClassUserAsync(int id);
        Task<ApiResponseDto<PagedResponse<ClassUserDto>>> SearchClassUsersAsync(SearchClassUsersDto dto);
        Task<ApiResponseDto<ClassUserDto>> CreateClassUserAsync(CreateClassUserDto dto);
        Task<ApiResponseDto<IList<ClassUserDto>>> GetMyClassesAsync();
        Task<ApiResponseDto<ClassUserDto>> AddMeToClassAsync(int classId);
        Task<ApiResponseDto<bool>> RemoveMeFromClassAsync(int classId);
        Task<ApiResponseDto<ClassUserDto>> UpdateClassUserAsync(int id, UpdateClassUserDto dto);
        Task<ApiResponseDto<bool>> DeleteClassUserAsync(int id);
    }
}
