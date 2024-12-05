
using LightNap.Core.Api;
using LightNap.Core.ClassInfos.Request.Dto;
using LightNap.Core.ClassInfos.Response.Dto;

namespace LightNap.Core.ClassInfos.Interfaces
{
    public interface IClassInfoService
    {
        Task<ApiResponseDto<ClassInfoDto>> GetClassInfoAsync(string id);
        Task<ApiResponseDto<PagedResponse<ClassInfoDto>>> SearchClassInfosAsync(SearchClassInfosDto dto);
        Task<ApiResponseDto<ClassInfoDto>> CreateClassInfoAsync(CreateClassInfoDto dto);
        Task<ApiResponseDto<ClassInfoDto>> UpdateClassInfoAsync(string id, UpdateClassInfoDto dto);
        Task<ApiResponseDto<bool>> DeleteClassInfoAsync(string id);
    }
}
