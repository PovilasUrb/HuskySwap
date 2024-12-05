
using LightNap.Core.Data.Entities;
using LightNap.Core.ClassInfos.Request.Dto;
using LightNap.Core.ClassInfos.Response.Dto;

namespace LightNap.Core.ClassInfos.Extensions
{
    public static class ClassTimeExtensions
    {
        public static ClassTimeDto ToDto(this ClassTime item)
        {
            // TODO: Update these fields to match the DTO.
            var dto = new ClassTimeDto
            {
                Id = item.Id,
                Day = item.Day,
                StartTime = item.StartTime,
                EndTime = item.EndTime
            };
            return dto;
        }
    }
}