using LightNap.Core.Api;
using LightNap.Core.ClassDesires.Request.Dto;
using LightNap.Core.ClassDesires.Response.Dto;
using LightNap.Core.ClassUsers.Response.Dto;
using LightNap.Core.Data.Entities;

namespace LightNap.Core.ClassDesires.Interfaces
{
    public interface IClassDesireService
    {
        Task<ApiResponseDto<ClassDesireDto>> GetClassDesireAsync(int id);
        Task<ApiResponseDto<PagedResponse<ClassDesireDto>>> SearchClassDesiresAsync(SearchClassDesiresDto dto);
        Task<ApiResponseDto<ClassDesireDto>> CreateClassDesireAsync(CreateClassDesireDto dto);
        Task<ApiResponseDto<ClassDesireDto>> UpdateClassDesireAsync(int id, UpdateClassDesireDto dto);
        Task<ApiResponseDto<IList<ClassDesireDto>>> GetMyClassesAsync();
        Task<ApiResponseDto<ClassDesireDto>> AddMeToClassAsync(string classId);
        Task<ApiResponseDto<bool>> RemoveMeFromClassAsync(string classId);
        Task<ApiResponseDto<bool>> DeleteClassDesireAsync(int id);
    }
}