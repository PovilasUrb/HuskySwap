
using LightNap.Core.Api;
using LightNap.Core.ClassInfos.Extensions;
using LightNap.Core.ClassInfos.Interfaces;
using LightNap.Core.ClassInfos.Request.Dto;
using LightNap.Core.ClassInfos.Response.Dto;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace LightNap.Core.ClassInfos.Services
{
    public class ClassInfoService(ApplicationDbContext db) : IClassInfoService
    {
        public async Task<ClassInfoDto?> GetClassInfoAsync(string id)
        {
            var item = await db.ClassInfos.FindAsync(id);
            return item?.ToDto();
        }

        public async Task<PagedResponse<ClassInfoDto>> SearchClassInfosAsync(SearchClassInfosDto dto)
        {
            var query = db.ClassInfos.AsQueryable();

            // Add filters and sorting
            if (dto.Id is not null)
            {
                query = query.Where((classInfo) => string.Compare(classInfo.Id, dto.Id) == 0);
            }
            if (dto.Title is not null)
            {
                query = query.Where((classInfo) => EF.Functions.Like(classInfo.Title!.ToLower(), $"%{dto.Title.ToLower()}%"));
            }
            if (dto.Instructor is not null)
            {
                query = query.Where((classInfo) => EF.Functions.Like(classInfo.Instructor!.ToLower(), $"%{dto.Instructor.ToLower()}%"));
            }

            query = query.OrderBy((classInfo) => classInfo.Id);

            int totalCount = await query.CountAsync();

            if (dto.PageNumber > 1)
            {
                query = query.Skip((dto.PageNumber - 1) * dto.PageSize);
            }

            var items = await query.Take(dto.PageSize).Select(user => user.ToDto()).ToListAsync();

            return new PagedResponse<ClassInfoDto>(items, dto.PageNumber, dto.PageSize, totalCount);
        }

        public async Task<ClassInfoDto> CreateClassInfoAsync(CreateClassInfoDto dto)
        {
            ClassInfo item = dto.ToCreate();
            db.ClassInfos.Add(item);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task<ClassInfoDto> UpdateClassInfoAsync(string id, UpdateClassInfoDto dto)
        {
            var item = await db.ClassInfos.FindAsync(id);
            if (item is null) { throw new UserFriendlyApiException("The specified ClassInfo was not found."); }
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task DeleteClassInfoAsync(string id)
        {
            var item = await db.ClassInfos.FindAsync(id);
            if (item is null) { throw new UserFriendlyApiException("The specified ClassInfo was not found."); }
            db.ClassInfos.Remove(item);
            await db.SaveChangesAsync();
        }
    }
}