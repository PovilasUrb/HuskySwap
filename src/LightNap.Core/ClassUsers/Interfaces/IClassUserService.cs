
using LightNap.Core.Api;
using LightNap.Core.ClassUsers.Request.Dto;
using LightNap.Core.ClassUsers.Response.Dto;

namespace LightNap.Core.ClassUsers.Interfaces
{
    public interface IClassUserService
    {
        Task<ClassUserDto?> GetClassUserAsync(int id);
        Task<PagedResponse<ClassUserDto>> SearchClassUsersAsync(SearchClassUsersDto dto);
        Task<ClassUserDto> CreateClassUserAsync(CreateClassUserDto dto);
        Task<IList<ClassUserDto>> GetMyClassesAsync();
        Task<ClassUserDto> AddMeToClassAsync(string classId);
        Task RemoveMeFromClassAsync(string classId);
        Task<ClassUserDto> UpdateClassUserAsync(int id, UpdateClassUserDto dto);
        Task DeleteClassUserAsync(int id);
    }
}
