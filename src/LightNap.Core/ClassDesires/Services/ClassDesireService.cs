using LightNap.Core.Api;
using LightNap.Core.ClassDesires.Extensions;
using LightNap.Core.ClassDesires.Interfaces;
using LightNap.Core.ClassDesires.Request.Dto;
using LightNap.Core.ClassDesires.Response.Dto;
using LightNap.Core.Data;
using LightNap.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LightNap.Core.ClassDesires.Services
{
    public class ClassDesireService(ApplicationDbContext db, IUserContext userContext) : IClassDesireService
    {
        public async Task<ClassDesireDto?> GetClassDesireAsync(int id)
        {
            var item = await db.ClassDesires.FindAsync(id);
            return item?.ToDto();
        }

        public async Task<PagedResponse<ClassDesireDto>> SearchClassDesiresAsync(SearchClassDesiresDto dto)
        {
            var query = db.ClassDesires.AsQueryable();

            // Add filters and sorting
            if (dto.ClassInfoId is not null)
            {
                query = query.Where((classDesire) => classDesire.ClassInfoId == dto.ClassInfoId);
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

            return new PagedResponse<ClassDesireDto>(items, dto.PageNumber, dto.PageSize, totalCount);
        }

        public async Task<IList<ClassDesireDto>> GetMyClassesAsync()
        {
            var items = await db.ClassDesires.Where((classDesire) => classDesire.UserId == userContext.GetUserId() && classDesire.IsActive).Select(user => user.ToDto()).ToListAsync();
            return items;
        }

        public async Task RemoveMeFromClassAsync(string classId)
        {
            var item = await db.GetClassOnActiveUserWishlistAsync(classId, userContext.GetUserId());
            if (item is null) { throw new UserFriendlyApiException("You don't have this class on your wishlist."); }
            item.IsActive = false;
            await db.SaveChangesAsync();
        }

        public async Task<ClassDesireDto> CreateClassDesireAsync(CreateClassDesireDto dto)
        {
            var item = await db.GetClassOnActiveUserWishlistAsync(dto.ClassInfoId, dto.UserId);
            if (item is not null) { throw new UserFriendlyApiException("User already has this class on their wishlist."); }
            item = dto.ToCreate();
            db.ClassDesires.Add(item);
            await db.SaveChangesAsync();
            return item.ToDto();
        }
        public async Task<ClassDesireDto> AddMeToClassAsync(string classId)
        {
            var classUser = await db.GetUserInActiveClassAsync(classId, userContext.GetUserId());
            if (classUser is not null) { throw new UserFriendlyApiException("You are already in this class."); }
            var item = await db.GetClassOnActiveUserWishlistAsync(classId, userContext.GetUserId());
            if (item is not null) { throw new UserFriendlyApiException("You already have this class on your wishlist."); }
            return await this.CreateClassDesireAsync(new CreateClassDesireDto() { ClassInfoId = classId, UserId = userContext.GetUserId() });
        }

        public async Task<ClassDesireDto> UpdateClassDesireAsync(int id, UpdateClassDesireDto dto)
        {
            var item = await db.ClassDesires.FindAsync(id);
            if (item is null) { throw new UserFriendlyApiException("The specified ClassDesire was not found."); }
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task DeleteClassDesireAsync(int id)
        {
            var item = await db.ClassDesires.FindAsync(id);
            if (item is null) { throw new UserFriendlyApiException("The specified ClassDesire was not found."); }
            db.ClassDesires.Remove(item);
            await db.SaveChangesAsync();
        }
    }
}
