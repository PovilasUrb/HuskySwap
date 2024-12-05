
using LightNap.Core.Api;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using LightNap.Core.ClassUsers.Extensions;
using LightNap.Core.ClassUsers.Interfaces;
using LightNap.Core.ClassUsers.Request.Dto;
using LightNap.Core.ClassUsers.Response.Dto;
using Microsoft.EntityFrameworkCore;
using LightNap.Core.Interfaces;
using static LightNap.Core.Configuration.Constants;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using LightNap.Core.ClassDesires.Interfaces;
using LightNap.Core.ClassDesires.Services;

namespace LightNap.Core.ClassUsers.Services
{
    public class ClassUserService(ApplicationDbContext db, IUserContext userContext, IClassDesireService classDesireService) : IClassUserService
    {
        public async Task<ApiResponseDto<ClassUserDto>> GetClassUserAsync(int id)
        {
            var item = await db.ClassUsers.FindAsync(id);
            return ApiResponseDto<ClassUserDto>.CreateSuccess(item?.ToDto());
        }

        public async Task<ApiResponseDto<PagedResponse<ClassUserDto>>> SearchClassUsersAsync(SearchClassUsersDto dto)
        {
            var query = db.ClassUsers.AsQueryable();

            // Add filters and sorting
            if (dto.ClassInfoId is not null)
            {
                query = query.Where((classUser) => classUser.ClassInfoId == dto.ClassInfoId);
            }
            if (dto.UserId is not null)
            {
                query = query.Where((classUser) => classUser.UserId == dto.UserId);
            }
            if (dto.IsActive is not null)
            {
                query = query.Where((classUser) => classUser.IsActive == dto.IsActive);
            }

            int totalCount = await query.CountAsync();

            if (dto.PageNumber > 1)
            {
                query = query.Skip((dto.PageNumber - 1) * dto.PageSize);
            }

            var items = await query.Take(dto.PageSize).Select(user => user.ToDto()).ToListAsync();

            return ApiResponseDto<PagedResponse<ClassUserDto>>.CreateSuccess(
                new PagedResponse<ClassUserDto>(items, dto.PageNumber, dto.PageSize, totalCount));
        }

        public async Task<ApiResponseDto<IList<ClassUserDto>>> GetMyClassesAsync()
        {
            var items = await db.ClassUsers.Where((classUser) => classUser.UserId == userContext.GetUserId() && classUser.IsActive).Select(user => user.ToDto()).ToListAsync();
            return ApiResponseDto<IList<ClassUserDto>>.CreateSuccess(items);
        }

        public async Task<ApiResponseDto<bool>> RemoveMeFromClassAsync(string classId)
        {
            var item = await db.GetUserInActiveClassAsync(classId, userContext.GetUserId());
            if (item is null) { return ApiResponseDto<bool>.CreateError("You are not in this class."); }
            item.IsActive = false;
            await db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }

        public async Task<ApiResponseDto<ClassUserDto>> CreateClassUserAsync(CreateClassUserDto dto)
        {
            var item = await db.GetUserInActiveClassAsync(dto.ClassInfoId, dto.UserId);
            if (item is not null) { return ApiResponseDto<ClassUserDto>.CreateError("User is already in this class."); }
            item = dto.ToCreate();
            db.ClassUsers.Add(item);
            await db.SaveChangesAsync();
            return ApiResponseDto<ClassUserDto>.CreateSuccess(item.ToDto());
        }

        public async Task<ApiResponseDto<ClassUserDto>> AddMeToClassAsync(string classId)
        {
            var item = await db.GetUserInActiveClassAsync(classId, userContext.GetUserId());
            if (item is not null) { return ApiResponseDto<ClassUserDto>.CreateError("You are already in this class."); }
            var createClass = await this.CreateClassUserAsync(new CreateClassUserDto() { ClassInfoId = classId, UserId = userContext.GetUserId() });
            if (createClass is null) { return ApiResponseDto<ClassUserDto>.CreateError("Failed to create class."); }
            var classDesire = await db.GetClassOnActiveUserWishlistAsync(classId, userContext.GetUserId());
            if (classDesire is not null) { await classDesireService.RemoveMeFromClassAsync(classId); }
            await db.SaveChangesAsync();
            return createClass;
        }

        public async Task<ApiResponseDto<ClassUserDto>> UpdateClassUserAsync(int id, UpdateClassUserDto dto)
        {
            var item = await db.ClassUsers.FindAsync(id);
            if (item is null) { return ApiResponseDto<ClassUserDto>.CreateError("The specified ClassUser was not found."); }
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return ApiResponseDto<ClassUserDto>.CreateSuccess(item.ToDto());
        }

        public async Task<ApiResponseDto<bool>> DeleteClassUserAsync(int id)
        {
            var item = await db.ClassUsers.FindAsync(id);
            if (item is null) { return ApiResponseDto<bool>.CreateError("The specified ClassUser was not found."); }
            db.ClassUsers.Remove(item);
            await db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }
    }
}