
using LightNap.Core.Api;
using LightNap.Core.ClassDesires.Interfaces;
using LightNap.Core.ClassUsers.Extensions;
using LightNap.Core.ClassUsers.Interfaces;
using LightNap.Core.ClassUsers.Request.Dto;
using LightNap.Core.ClassUsers.Response.Dto;
using LightNap.Core.Data;
using LightNap.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LightNap.Core.ClassUsers.Services
{
    public class ClassUserService(ApplicationDbContext db, IUserContext userContext, IClassDesireService classDesireService) : IClassUserService
    {
        public async Task<ClassUserDto?> GetClassUserAsync(int id)
        {
            var item = await db.ClassUsers.FindAsync(id);
            return item?.ToDto();
        }

        public async Task<PagedResponse<ClassUserDto>> SearchClassUsersAsync(SearchClassUsersDto dto)
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

            return new PagedResponse<ClassUserDto>(items, dto.PageNumber, dto.PageSize, totalCount);
        }

        public async Task<IList<ClassUserDto>> GetMyClassesAsync()
        {
            var items = await db.ClassUsers.Where((classUser) => classUser.UserId == userContext.GetUserId() && classUser.IsActive).Select(user => user.ToDto()).ToListAsync();
            return items;
        }

        public async Task RemoveMeFromClassAsync(string classId)
        {
            var item = await db.GetUserInActiveClassAsync(classId, userContext.GetUserId());
            if (item is null) { throw new UserFriendlyApiException("You are not in this class."); }
            item.IsActive = false;
            await db.SaveChangesAsync();
        }

        public async Task<ClassUserDto> CreateClassUserAsync(CreateClassUserDto dto)
        {
            var item = await db.GetUserInActiveClassAsync(dto.ClassInfoId, dto.UserId);
            if (item is not null) { throw new UserFriendlyApiException("User is already in this class."); }
            item = dto.ToCreate();
            db.ClassUsers.Add(item);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task<ClassUserDto> AddMeToClassAsync(string classId)
        {
            var item = await db.GetUserInActiveClassAsync(classId, userContext.GetUserId());
            if (item is not null) { throw new UserFriendlyApiException("You are already in this class."); }
            var createClass = await this.CreateClassUserAsync(new CreateClassUserDto() { ClassInfoId = classId, UserId = userContext.GetUserId() });
            if (createClass is null) { throw new UserFriendlyApiException("Failed to create class."); }
            var classDesire = await db.GetClassOnActiveUserWishlistAsync(classId, userContext.GetUserId());
            if (classDesire is not null) { await classDesireService.RemoveMeFromClassAsync(classId); }
            await db.SaveChangesAsync();
            return createClass;
        }

        public async Task<ClassUserDto> UpdateClassUserAsync(int id, UpdateClassUserDto dto)
        {
            var item = await db.ClassUsers.FindAsync(id);
            if (item is null) { throw new UserFriendlyApiException("The specified ClassUser was not found."); }
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task DeleteClassUserAsync(int id)
        {
            var item = await db.ClassUsers.FindAsync(id);
            if (item is null) { throw new UserFriendlyApiException("The specified ClassUser was not found."); }
            db.ClassUsers.Remove(item);
            await db.SaveChangesAsync();
        }
    }
}