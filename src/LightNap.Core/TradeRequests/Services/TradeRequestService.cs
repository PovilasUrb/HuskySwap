
using LightNap.Core.Api;
using LightNap.Core.ClassUsers.Extensions;
using LightNap.Core.Configuration;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using LightNap.Core.Interfaces;
using LightNap.Core.TradeRequests.Extensions;
using LightNap.Core.TradeRequests.Interfaces;
using LightNap.Core.TradeRequests.Request.Dto;
using LightNap.Core.TradeRequests.Response.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net.Mail;

namespace LightNap.Core.TradeRequests.Services
{
    public class TradeRequestService(ApplicationDbContext db, IUserContext userContext, IEmailService emailService, IOptions<ApplicationSettings> applicationSettings) : ITradeRequestService
    {
        public async Task<TradeRequestDto?> GetTradeRequestAsync(int id)
        {
            var item = await db.TradeRequests.FindAsync(id);
            return item?.ToDto();
        }

        public async Task<PagedResponse<TradeRequestDto>> SearchTradeRequestsAsync(SearchTradeRequestsDto dto)
        {
            var query = db.TradeRequests.AsQueryable();

            // Add filters and sorting

            int totalCount = await query.CountAsync();

            if (dto.PageNumber > 1)
            {
                query = query.Skip((dto.PageNumber - 1) * dto.PageSize);
            }

            var items = await query.Take(dto.PageSize).Select(user => user.ToDto()).ToListAsync();

            return new PagedResponse<TradeRequestDto>(items, dto.PageNumber, dto.PageSize, totalCount);
        }

        public async Task<TradeRequestDto> CreateTradeRequestAsync(CreateTradeRequestDto dto)
        {
            var tradeRequest = await db.TradeRequests.FirstOrDefaultAsync(tradeRequest => tradeRequest.TargetClassUserId == dto.TargetClassUserId && tradeRequest.RequestingClassUserId == dto.RequestingClassUserId && tradeRequest.Status == TradeRequestStatus.Pending);
            if (tradeRequest is not null) { throw new UserFriendlyApiException("This trade request already exists."); }
            var requestingClassUser = await db.ClassUsers.FirstOrDefaultAsync(classUser => classUser.Id == dto.RequestingClassUserId && classUser.IsActive);
            if (requestingClassUser is null) { throw new UserFriendlyApiException("You are not in this class."); }
            var targetClassUser = await db.ClassUsers.FirstOrDefaultAsync(classUser => classUser.Id == dto.TargetClassUserId && classUser.IsActive);
            if (targetClassUser is null) { throw new UserFriendlyApiException("The target classUser does not exist."); }
            if (targetClassUser.UserId == requestingClassUser.UserId) { throw new UserFriendlyApiException("You cannot trade with yourself."); }
            if (targetClassUser.ClassInfoId == requestingClassUser.ClassInfoId) { throw new UserFriendlyApiException("You cannot trade the same class for itself."); }
            TradeRequest item = dto.ToCreate();
            db.TradeRequests.Add(item);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task<TradeRequestDto> MakeATradeRequestAsync(CreateTradeRequestDto dto)
        {
            if (!await db.ClassUsers.AnyAsync((classUser) => classUser.UserId == userContext.GetUserId() && classUser.Id == dto.RequestingClassUserId))
            {
                throw new UserFriendlyApiException("You are not in this class.");
            }
            var item = await this.CreateTradeRequestAsync(dto);

            // TODO:
            var requestingClassUser = await db.ClassUsers.Include((classUsers) => classUsers.User).FirstAsync((classUser) => classUser.Id == dto.RequestingClassUserId);
            var targetClassUser = await db.ClassUsers.Include((classUsers) => classUsers.User).FirstAsync((classUser) => classUser.Id == dto.TargetClassUserId);
            var msg = new MailMessage(
                "placeholder@email.com",
                targetClassUser.User!.Email!,
                "HuskySwap Trade Request",
                $"You've received a trade request! Check it out <a href=\"{applicationSettings.Value.SiteUrlRootForEmails}#/trade-requests/{item.Id}/respond\">here</a>.")
            {
                IsBodyHtml = true
            };
            await emailService.SendEmailAsync(msg);

            return item;
        }

        public async Task CancelMyTradeRequestAsync(int id)
        {
            var tradeRequest = await db.TradeRequests.Include(tradeRequest => tradeRequest.RequestingClassUser).FirstAsync(tradeRequest => tradeRequest.Id == id);
            if (tradeRequest is null || tradeRequest.RequestingClassUser is null)
            {
                throw new UserFriendlyApiException("This trade request is not valid.");
            }
            if (tradeRequest.RequestingClassUser!.UserId != userContext.GetUserId())
            {
                throw new UserFriendlyApiException("You cannot accept this trade request.");
            }
            await this.CancelTradeRequestAsync(id);
        }

        public async Task CancelTradeRequestAsync(int id)
        {
            var tradeRequest = await db.TradeRequests.FirstAsync(tradeRequest => tradeRequest.Id == id);
            if (tradeRequest is null)
            {
                throw new UserFriendlyApiException("This trade request is not valid.");
            }
            if (tradeRequest.Status != TradeRequestStatus.Pending)
            {
                throw new UserFriendlyApiException("This trade request cannot be canceled.");
            }
            tradeRequest.Status = TradeRequestStatus.Canceled;
            await db.SaveChangesAsync();
        }

        public async Task RespondToMyTradeRequestAsync(int id, bool accept)
        {
            var tradeRequest = await db.TradeRequests.Include(tradeRequest => tradeRequest.TargetClassUser).FirstAsync(tradeRequest => tradeRequest.Id == id);
            if (tradeRequest is null || tradeRequest.TargetClassUser is null)
            {
                throw new UserFriendlyApiException("This trade request is not valid.");
            }
            if (tradeRequest.TargetClassUser!.UserId != userContext.GetUserId())
            {
                throw new UserFriendlyApiException("You cannot accept this trade request.");
            }
            await this.RespondToTradeRequestAsync(id, accept);
        }

        public async Task RespondToTradeRequestAsync(int id, bool accept)
        {
            var tradeRequest = await db.TradeRequests.FirstAsync(tradeRequest => tradeRequest.Id == id);
            if (tradeRequest is null)
            {
                throw new UserFriendlyApiException("This trade request is not valid.");
            }
            if (tradeRequest.Status != TradeRequestStatus.Pending)
            {
                throw new UserFriendlyApiException("This trade request is no longer pending.");
            }
            var requestingClassUser = await db.ClassUsers.Include((classUser) => classUser.User).FirstAsync((classUser) => classUser.Id == tradeRequest.RequestingClassUserId && classUser.IsActive == true);
            if (requestingClassUser is null || requestingClassUser.User is null)
            {
                throw new UserFriendlyApiException("The requesting user does not have this class.");
            }
            var targetClassUser = await db.ClassUsers.Include((classUser) => classUser.User).FirstAsync((classUser) => classUser.Id == tradeRequest.TargetClassUserId && classUser.IsActive == true);
            if (targetClassUser is null || targetClassUser.User is null)
            {
                throw new UserFriendlyApiException("The target user does not have this class.");
            }

            tradeRequest.Status = accept ? TradeRequestStatus.Accepted : TradeRequestStatus.Rejected;
            await db.SaveChangesAsync();

            if (accept)
            {
                await emailService.SendEmailAsync(new System.Net.Mail.MailMessage(
                    "placeholder@email.com",
                    $"{requestingClassUser.User!.Email!},{targetClassUser.User!.Email!}",
                    "HuskySwap Trade Request Response",
                    "Hey! You guys just completed a successful trade request!"));
            }
        }

        public async Task<IList<TradeRequestDto>> GetMyTradeRequestsReceivedAsync()
        {
            return await db.TradeRequests.Where((tradeRequest) => tradeRequest.TargetClassUser!.UserId == userContext.GetUserId()).Select(tradeRequest => tradeRequest.ToDto()).ToListAsync();
        }

        public async Task<IList<TradeRequestDto>> GetMyTradeRequestsSentAsync()
        {
            return await db.TradeRequests.Where((tradeRequest) => tradeRequest.RequestingClassUser!.UserId == userContext.GetUserId()).Select(tradeRequest => tradeRequest.ToDto()).ToListAsync();
        }

        public async Task<TradeRequestDto> UpdateTradeRequestAsync(int id, UpdateTradeRequestDto dto)
        {
            var item = await db.TradeRequests.FindAsync(id);
            if (item is null) { throw new UserFriendlyApiException("The specified TradeRequest was not found."); }
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task DeleteTradeRequestAsync(int id)
        {
            var item = await db.TradeRequests.FindAsync(id);
            if (item is null) { throw new UserFriendlyApiException("The specified TradeRequest was not found."); }
            db.TradeRequests.Remove(item);
            await db.SaveChangesAsync();
        }

        public async Task<ChatMessageDto> CreateChatMessageAsync(CreateChatMessageDto dto, int tradeRequestId)
        {
            string userId = userContext.GetUserId();
            var tradeRequest = await db.TradeRequests.FirstOrDefaultAsync((tradeRequest) => tradeRequestId == tradeRequest.Id && (userId == tradeRequest.RequestingClassUser!.UserId || userId == tradeRequest.TargetClassUser!.UserId));
            if (tradeRequest is null)
            {
                throw new UserFriendlyApiException("The specified TradeRequest was not found.");
            }
            ChatMessage item = dto.ToCreate(userId, tradeRequestId);
            db.ChatMessages.Add(item);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task<IList<ChatMessageDto>> GetChatMessagesAsync(int tradeRequestId, int sinceMessageId)
        {
            string userId = userContext.GetUserId();
            var tradeRequest = await db.TradeRequests.Include(tradeRequest => tradeRequest.ChatMessages).FirstOrDefaultAsync((tradeRequest) => tradeRequestId == tradeRequest.Id && (userId == tradeRequest.RequestingClassUser!.UserId || userId == tradeRequest.TargetClassUser!.UserId));
            if (tradeRequest is null)
            {
                throw new UserFriendlyApiException("The specified TradeRequest was not found.");
            }
            return tradeRequest.ChatMessages!.Where(chatMessage => chatMessage.Id > sinceMessageId).Select(chatMessage => chatMessage.ToDto()).ToList();
        }
    }
}