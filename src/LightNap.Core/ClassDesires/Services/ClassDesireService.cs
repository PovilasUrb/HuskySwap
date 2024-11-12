using LightNap.Core.Api;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using LightNap.Core.ClassDesires.Extensions;
using LightNap.Core.ClassDesires.Interfaces;
using LightNap.Core.ClassDesires.Request.Dto;
using LightNap.Core.ClassDesires.Response.Dto;
using Microsoft.EntityFrameworkCore;
using LightNap.Core.Interfaces;
using LightNap.Core.ClassUsers.Services;
using LightNap.Core.ClassUsers.Interfaces;

namespace LightNap.Core.ClassDesires.Services
{
    public class ClassDesireService(ApplicationDbContext db, IUserContext userContext) : IClassDesireService
    {
        public async Task<ApiResponseDto<ClassDesireDto>> GetClassDesireAsync(int id)
        {
            var item = await db.ClassDesires.FindAsync(id);
            return ApiResponseDto<ClassDesireDto>.CreateSuccess(item?.ToDto());
        }

        public async Task<ApiResponseDto<PagedResponse<ClassDesireDto>>> SearchClassDesiresAsync(SearchClassDesiresDto dto)
        {
            var query = db.ClassDesires.AsQueryable();

            // Add filters and sorting
            if (dto.ClassId is not null)
            {
                query = query.Where((classDesire) => classDesire.ClassId == dto.ClassId);
            }
            if (dto.UserId is not null)
            {
                query = query.Where((classDesire) => classDesire.UserId == dto.UserId);
            }
            if (dto.IsActive is not null)
            {
                query = query.Where((classDesire) => classDesire.IsActive == dto.IsActive);
            }

            int totalCount = await query.CountAsync();

            if (dto.PageNumber > 1)
            {
                query = query.Skip((dto.PageNumber - 1) * dto.PageSize);
            }

            var items = await query.Take(dto.PageSize).Select(user => user.ToDto()).ToListAsync();

            return ApiResponseDto<PagedResponse<ClassDesireDto>>.CreateSuccess(
                new PagedResponse<ClassDesireDto>(items, dto.PageNumber, dto.PageSize, totalCount));
        }

        public async Task<ApiResponseDto<IList<ClassDesireDto>>> GetMyClassesAsync()
        {
            var items = await db.ClassDesires.Where((classDesire) => classDesire.UserId == userContext.GetUserId() && classDesire.IsActive).Select(user => user.ToDto()).ToListAsync();
            return ApiResponseDto<IList<ClassDesireDto>>.CreateSuccess(items);
        }

        public async Task<ApiResponseDto<bool>> RemoveMeFromClassAsync(int classId)
        {
            var item = await db.GetClassOnActiveUserWishlistAsync(classId, userContext.GetUserId());
            if (item is null) { return ApiResponseDto<bool>.CreateError("You don't have this class on your wishlist."); }
            item.IsActive = false;
            await db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }

        public async Task<ApiResponseDto<ClassDesireDto>> CreateClassDesireAsync(CreateClassDesireDto dto)
        {
            var item = await db.GetClassOnActiveUserWishlistAsync(dto.ClassId, dto.UserId);
            if (item is not null) { return ApiResponseDto<ClassDesireDto>.CreateError("User already has this class on their wishlist."); }
            item = dto.ToCreate(userContext.GetUserId());
            db.ClassDesires.Add(item);
            await db.SaveChangesAsync();
            return ApiResponseDto<ClassDesireDto>.CreateSuccess(item.ToDto());
        }
        public async Task<ApiResponseDto<ClassDesireDto>> AddMeToClassAsync(int classId)
        {
            var classUser = await db.GetUserInActiveClassAsync(classId, userContext.GetUserId());
            if (classUser is not null) { return ApiResponseDto<ClassDesireDto>.CreateError("You are already in this class."); }
            var item = await db.GetClassOnActiveUserWishlistAsync(classId, userContext.GetUserId());
            if (item is not null) { return ApiResponseDto<ClassDesireDto>.CreateError("You already have this class on your wishlist."); }
            return await this.CreateClassDesireAsync(new CreateClassDesireDto() { ClassId = classId, UserId = userContext.GetUserId() });
        }

        public async Task<ApiResponseDto<ClassDesireDto>> UpdateClassDesireAsync(int id, UpdateClassDesireDto dto)
        {
            var item = await db.ClassDesires.FindAsync(id);
            if (item is null) { return ApiResponseDto<ClassDesireDto>.CreateError("The specified ClassDesire was not found."); }
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return ApiResponseDto<ClassDesireDto>.CreateSuccess(item.ToDto());
        }

        public async Task<ApiResponseDto<bool>> DeleteClassDesireAsync(int id)
        {
            var item = await db.ClassDesires.FindAsync(id);
            if (item is null) { return ApiResponseDto<bool>.CreateError("The specified ClassDesire was not found."); }
            db.ClassDesires.Remove(item);
            await db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }
    }
}
