using LightNap.Core.Api;
using LightNap.Core.ClassDesires.Request.Dto;
using LightNap.Core.ClassDesires.Response.Dto;

namespace LightNap.Core.ClassDesires.Interfaces
{
    public interface IClassDesireService
    {
        Task<ClassDesireDto?> GetClassDesireAsync(int id);
        Task<PagedResponse<ClassDesireDto>> SearchClassDesiresAsync(SearchClassDesiresDto dto);
        Task<ClassDesireDto> CreateClassDesireAsync(CreateClassDesireDto dto);
        Task<ClassDesireDto> UpdateClassDesireAsync(int id, UpdateClassDesireDto dto);
        Task<IList<ClassDesireDto>> GetMyClassesAsync();
        Task<ClassDesireDto> AddMeToClassAsync(string classId);
        Task RemoveMeFromClassAsync(string classId);
        Task DeleteClassDesireAsync(int id);
    }
}