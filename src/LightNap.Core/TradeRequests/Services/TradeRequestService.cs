
using LightNap.Core.Api;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using LightNap.Core.Interfaces;
using LightNap.Core.TradeRequests.Extensions;
using LightNap.Core.TradeRequests.Interfaces;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LightNap.Core.TradeRequests.Services
{
    public class TradeRequestService(ApplicationDbContext db, IUserContext userContext, IEmailService emailService) : ITradeRequestService
    {
        public async Task<ApiResponseDto<TradeRequestDto>> GetTradeRequestAsync(int id)
        {
            var item = await db.TradeRequests.FindAsync(id);
            return ApiResponseDto<TradeRequestDto>.CreateSuccess(item?.ToDto());
        }

        public async Task<ApiResponseDto<PagedResponse<TradeRequestDto>>> SearchTradeRequestsAsync(SearchTradeRequestsDto dto)
        {
            var query = db.TradeRequests.AsQueryable();

            // Add filters and sorting

            int totalCount = await query.CountAsync();

            if (dto.PageNumber > 1)
            {
                query = query.Skip((dto.PageNumber - 1) * dto.PageSize);
            }

            var items = await query.Take(dto.PageSize).Select(user => user.ToDto()).ToListAsync();

            return ApiResponseDto<PagedResponse<TradeRequestDto>>.CreateSuccess(
                new PagedResponse<TradeRequestDto>(items, dto.PageNumber, dto.PageSize, totalCount));
        }

        public async Task<ApiResponseDto<TradeRequestDto>> CreateTradeRequestAsync(CreateTradeRequestDto dto)
        {
            var requestingClassUser = await db.ClassUsers.FirstOrDefaultAsync(classUser => classUser.Id == dto.RequestingClassUserId && classUser.IsActive);
            if (requestingClassUser is null) { return ApiResponseDto<TradeRequestDto>.CreateError("You are not in this class."); }
            var targetClassUser = await db.ClassUsers.FirstOrDefaultAsync(classUser => classUser.Id == dto.TargetClassUserId && classUser.IsActive);
            if (targetClassUser is null) { return ApiResponseDto<TradeRequestDto>.CreateError("The target classUser does not exist."); }
            if (targetClassUser.UserId == requestingClassUser.UserId) { return ApiResponseDto<TradeRequestDto>.CreateError("You cannot trade with yourself."); }
            if (targetClassUser.ClassId == requestingClassUser.ClassId) { return ApiResponseDto<TradeRequestDto>.CreateError("You cannot trade the same class for itself."); }
            TradeRequest item = dto.ToCreate();
            db.TradeRequests.Add(item);
            await db.SaveChangesAsync();
            return ApiResponseDto<TradeRequestDto>.CreateSuccess(item.ToDto());
        }

        public async Task<ApiResponseDto<TradeRequestDto>> MakeATradeRequestAsync(CreateTradeRequestDto dto)
        {
            if (!await db.ClassUsers.AnyAsync((classUser) => classUser.UserId == userContext.GetUserId() && classUser.Id == dto.RequestingClassUserId))
            {
                return ApiResponseDto<TradeRequestDto>.CreateError("You are not in this class.");
            }
            var item = await this.CreateTradeRequestAsync(dto);
            if (item.Type == ApiResponseType.Success)
            {
                // TODO:
                var requestingClassUser = await db.ClassUsers.Include((classUsers) => classUsers.User).FirstAsync((classUser) => classUser.Id == dto.RequestingClassUserId);
                var targetClassUser = await db.ClassUsers.Include((classUsers) => classUsers.User).FirstAsync((classUser) => classUser.Id == dto.TargetClassUserId);
                await emailService.SendEmailAsync(new System.Net.Mail.MailMessage(requestingClassUser.User!.Email!, targetClassUser.User!.Email!, "HuskySwap Trade Request", "Hey, I've sent you a trade request via HuskySwap! Check it out!"));
            }
            return item;
        }

        public async Task<ApiResponseDto<TradeRequestDto>> UpdateTradeRequestAsync(int id, UpdateTradeRequestDto dto)
        {
            var item = await db.TradeRequests.FindAsync(id);
            if (item is null) { return ApiResponseDto<TradeRequestDto>.CreateError("The specified TradeRequest was not found."); }
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return ApiResponseDto<TradeRequestDto>.CreateSuccess(item.ToDto());
        }

        public async Task<ApiResponseDto<bool>> DeleteTradeRequestAsync(int id)
        {
            var item = await db.TradeRequests.FindAsync(id);
            if (item is null) { return ApiResponseDto<bool>.CreateError("The specified TradeRequest was not found."); }
            db.TradeRequests.Remove(item);
            await db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }
    }
}