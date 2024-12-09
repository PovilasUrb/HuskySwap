
using LightNap.Core.Api;
using LightNap.Core.ClassInfos.Request.Dto;
using LightNap.Core.ClassInfos.Response.Dto;

namespace LightNap.Core.ClassInfos.Interfaces
{
    public interface IClassInfoService
    {
        Task<ClassInfoDto?> GetClassInfoAsync(string id);
        Task<PagedResponse<ClassInfoDto>> SearchClassInfosAsync(SearchClassInfosDto dto);
        Task<ClassInfoDto> CreateClassInfoAsync(CreateClassInfoDto dto);
        Task<ClassInfoDto> UpdateClassInfoAsync(string id, UpdateClassInfoDto dto);
        Task DeleteClassInfoAsync(string id);
    }
}
