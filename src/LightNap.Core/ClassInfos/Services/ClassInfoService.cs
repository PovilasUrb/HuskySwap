using LightNap.Core.Api;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using LightNap.Core.ClassInfos.Extensions;
using LightNap.Core.ClassInfos.Interfaces;
using LightNap.Core.ClassInfos.Request.Dto;
using LightNap.Core.ClassInfos.Response.Dto;
using Microsoft.EntityFrameworkCore;

namespace LightNap.Core.ClassInfos.Services
{
    public class ClassInfoService(ApplicationDbContext db) : IClassInfoService
    {
        public async Task<ApiResponseDto<ClassInfoDto>> GetClassInfoAsync(int id)
        {
            var item = await db.ClassInfos.FindAsync(id);
            return ApiResponseDto<ClassInfoDto>.CreateSuccess(item?.ToDto());
        }

        public async Task<ApiResponseDto<PagedResponse<ClassInfoDto>>> SearchClassInfosAsync(SearchClassInfosDto dto)
        {
            var query = db.ClassInfos.AsQueryable();

            // Add filters and sorting

            int totalCount = await query.CountAsync();

            if (dto.PageNumber > 1)
            {
                query = query.Skip((dto.PageNumber - 1) * dto.PageSize);
            }

            var items = await query.Take(dto.PageSize).Select(user => user.ToDto()).ToListAsync();

            return ApiResponseDto<PagedResponse<ClassInfoDto>>.CreateSuccess(
                new PagedResponse<ClassInfoDto>(items, dto.PageNumber, dto.PageSize, totalCount));
        }

        public async Task<ApiResponseDto<ClassInfoDto>> CreateClassInfoAsync(CreateClassInfoDto dto)
        {
            ClassInfo item = dto.ToCreate();
            db.ClassInfos.Add(item);
            await db.SaveChangesAsync();
            return ApiResponseDto<ClassInfoDto>.CreateSuccess(item.ToDto());
        }

        public async Task<ApiResponseDto<ClassInfoDto>> UpdateClassInfoAsync(int id, UpdateClassInfoDto dto)
        {
            var item = await db.ClassInfos.FindAsync(id);
            if (item is null) { return ApiResponseDto<ClassInfoDto>.CreateError("The specified ClassInfo was not found."); }
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return ApiResponseDto<ClassInfoDto>.CreateSuccess(item.ToDto());
        }

        public async Task<ApiResponseDto<bool>> DeleteClassInfoAsync(int id)
        {
            var item = await db.ClassInfos.FindAsync(id);
            if (item is null) { return ApiResponseDto<bool>.CreateError("The specified ClassInfo was not found."); }
            db.ClassInfos.Remove(item);
            await db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }
    }
}
