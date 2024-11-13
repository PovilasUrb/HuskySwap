using LightNap.Core.Data.Entities;
using LightNap.Core.ClassDesires.Request.Dto;
using LightNap.Core.ClassDesires.Response.Dto;

namespace LightNap.Core.ClassDesires.Extensions
{
    public static class ClassDesireExtensions
    {
        public static ClassDesire ToCreate(this CreateClassDesireDto dto)
        {
            // TODO: Update these fields to match the DTO.
            var item = new ClassDesire
            {
                ClassId = dto.ClassId,
                UserId = dto.UserId,
                IsActive = true
            };
            return item;
        }

        public static ClassDesireDto ToDto(this ClassDesire item)
        {
            // TODO: Update these fields to match the DTO.
            var dto = new ClassDesireDto();
            dto.Id = item.Id;
            dto.ClassId = item.ClassId;
			dto.UserId = item.UserId;
			dto.IsActive = item.IsActive;
            return dto;
        }

        public static void UpdateFromDto(this ClassDesire item, UpdateClassDesireDto dto)
        {
            // TODO: Update these fields to match the DTO.
			item.IsActive = dto.IsActive;
        }
    }
}