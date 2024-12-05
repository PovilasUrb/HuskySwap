
using LightNap.Core.Api;
using LightNap.Core.ClassInfos.Response.Dto;
using LightNap.Core.ClassUsers.Extensions;
using LightNap.Core.ClassUsers.Interfaces;
using LightNap.Core.ClassUsers.Request.Dto;
using LightNap.Core.ClassUsers.Response.Dto;
using LightNap.Core.Configuration;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using LightNap.Core.Interfaces;
using LightNap.Core.Profile.Dto.Response;
using LightNap.Core.TradeRequests.Extensions;
using LightNap.Core.TradeRequests.Interfaces;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net.Mail;
using static LightNap.Core.Configuration.Constants;

namespace LightNap.Core.TradeRequests.Services
{
    public class TradeRequestService(ApplicationDbContext db, IUserContext userContext, IEmailService emailService, IOptions<ApplicationSettings> applicationSettings) : ITradeRequestService
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
            var tradeRequest = await db.TradeRequests.FirstOrDefaultAsync(tradeRequest => tradeRequest.TargetClassUserId == dto.TargetClassUserId && tradeRequest.RequestingClassUserId == dto.RequestingClassUserId && tradeRequest.Status == TradeRequestStatus.Pending);
            if (tradeRequest is not null) { return ApiResponseDto<TradeRequestDto>.CreateError("This trade request already exists."); }
            var requestingClassUser = await db.ClassUsers.FirstOrDefaultAsync(classUser => classUser.Id == dto.RequestingClassUserId && classUser.IsActive);
            if (requestingClassUser is null) { return ApiResponseDto<TradeRequestDto>.CreateError("You are not in this class."); }
            var targetClassUser = await db.ClassUsers.FirstOrDefaultAsync(classUser => classUser.Id == dto.TargetClassUserId && classUser.IsActive);
            if (targetClassUser is null) { return ApiResponseDto<TradeRequestDto>.CreateError("The target classUser does not exist."); }
            if (targetClassUser.UserId == requestingClassUser.UserId) { return ApiResponseDto<TradeRequestDto>.CreateError("You cannot trade with yourself."); }
            if (targetClassUser.ClassInfoId == requestingClassUser.ClassInfoId) { return ApiResponseDto<TradeRequestDto>.CreateError("You cannot trade the same class for itself."); }
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
                var msg = new MailMessage(
                    "placeholder@email.com",
                    targetClassUser.User!.Email!,
                    "HuskySwap Trade Request",
                    $"You've received a trade request! Check it out <a href=\"{applicationSettings.Value.SiteUrlRootForEmails}#/trade-requests/{item.Result!.Id}/respond\">here</a>.");
                msg.IsBodyHtml = true;
                await emailService.SendEmailAsync(msg);
            }
            return item;
        }

        public async Task<ApiResponseDto<bool>> CancelMyTradeRequestAsync(int id)
        {
            var tradeRequest = await db.TradeRequests.Include(tradeRequest => tradeRequest.RequestingClassUser).FirstAsync(tradeRequest => tradeRequest.Id == id);
            if (tradeRequest is null || tradeRequest.RequestingClassUser is null)
            {
                return ApiResponseDto<bool>.CreateError("This trade request is not valid.");
            }
            if (tradeRequest.RequestingClassUser!.UserId != userContext.GetUserId())
            {
                return ApiResponseDto<bool>.CreateError("You cannot accept this trade request.");
            }
            return await this.CancelTradeRequestAsync(id);
        }

        public async Task<ApiResponseDto<bool>> CancelTradeRequestAsync(int id)
        {
            var tradeRequest = await db.TradeRequests.FirstAsync(tradeRequest => tradeRequest.Id == id);
            if (tradeRequest is null)
            {
                return ApiResponseDto<bool>.CreateError("This trade request is not valid.");
            }
            if (tradeRequest.Status != TradeRequestStatus.Pending)
            {
                return ApiResponseDto<bool>.CreateError("This trade request cannot be canceled.");
            }
            tradeRequest.Status = TradeRequestStatus.Canceled;
            await db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }

        public async Task<ApiResponseDto<bool>> RespondToMyTradeRequestAsync(int id, bool accept)
        {
            var tradeRequest = await db.TradeRequests.Include(tradeRequest => tradeRequest.TargetClassUser).FirstAsync(tradeRequest => tradeRequest.Id == id);
            if (tradeRequest is null || tradeRequest.TargetClassUser is null)
            {
                return ApiResponseDto<bool>.CreateError("This trade request is not valid.");
            }
            if (tradeRequest.TargetClassUser!.UserId != userContext.GetUserId())
            {
                return ApiResponseDto<bool>.CreateError("You cannot accept this trade request.");
            }
            return await this.RespondToTradeRequestAsync(id, accept);
        }

        public async Task<ApiResponseDto<bool>> RespondToTradeRequestAsync(int id, bool accept)
        {
            var tradeRequest = await db.TradeRequests.FirstAsync(tradeRequest => tradeRequest.Id == id);
            if (tradeRequest is null)
            {
                return ApiResponseDto<bool>.CreateError("This trade request is not valid.");
            }
            if (tradeRequest.Status != TradeRequestStatus.Pending)
            {
                return ApiResponseDto<bool>.CreateError("This trade request is no longer pending.");
            }
            var requestingClassUser = await db.ClassUsers.Include((classUser) => classUser.User).FirstAsync((classUser) => classUser.Id == tradeRequest.RequestingClassUserId && classUser.IsActive == true);
            if (requestingClassUser is null || requestingClassUser.User is null)
            {
                return ApiResponseDto<bool>.CreateError("The requesting user does not have this class.");
            }
            var targetClassUser = await db.ClassUsers.Include((classUser) => classUser.User).FirstAsync((classUser) => classUser.Id == tradeRequest.TargetClassUserId && classUser.IsActive == true);
            if (targetClassUser is null || targetClassUser.User is null)
            {
                return ApiResponseDto<bool>.CreateError("The target user does not have this class.");
            }
            if (accept)
            {
                tradeRequest.Status = TradeRequestStatus.Accepted;
                await db.SaveChangesAsync();
                await emailService.SendEmailAsync(new System.Net.Mail.MailMessage(
                    "placeholder@email.com", 
                    $"{requestingClassUser.User!.Email!},{targetClassUser.User!.Email!}",
                    "HuskySwap Trade Request Response",
                    "Hey! You guys just completed a successful trade request!"));
                return ApiResponseDto<bool>.CreateSuccess(true);
            }
            tradeRequest.Status = TradeRequestStatus.Rejected;
            await db.SaveChangesAsync();
            return ApiResponseDto<bool>.CreateSuccess(true);
        }

        public async Task<ApiResponseDto<IList<TradeRequestDto>>> GetMyTradeRequestsReceivedAsync()
        {
            var items = await db.TradeRequests.Where((tradeRequest) => tradeRequest.TargetClassUser!.UserId == userContext.GetUserId()).Select(tradeRequest => tradeRequest.ToDto()).ToListAsync();
            return ApiResponseDto<IList<TradeRequestDto>>.CreateSuccess(items);
        }

        public async Task<ApiResponseDto<IList<TradeRequestDto>>> GetMyTradeRequestsSentAsync()
        {
            var items = await db.TradeRequests.Where((tradeRequest) => tradeRequest.RequestingClassUser!.UserId == userContext.GetUserId()).Select(tradeRequest => tradeRequest.ToDto()).ToListAsync();
            return ApiResponseDto<IList<TradeRequestDto>>.CreateSuccess(items);
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