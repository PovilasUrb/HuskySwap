
using LightNap.Core.Data.Entities;
using LightNap.Core.ClassInfos.Request.Dto;
using LightNap.Core.ClassInfos.Response.Dto;

namespace LightNap.Core.ClassInfos.Extensions
{
    public static class ClassInfoExtensions
    {
        public static ClassInfo ToCreate(this CreateClassInfoDto dto)
        {
            // TODO: Update these fields to match the DTO.
            var item = new ClassInfo
            {
                Title = dto.Title,
                Description = dto.Description,
                Instructor = dto.Instructor,
                ClassCode = dto.ClassCode,
                Notes = dto.Notes
            };
            return item;
        }

        public static ClassInfoDto ToDto(this ClassInfo item)
        {
            // TODO: Update these fields to match the DTO.
            var dto = new ClassInfoDto
            {
                Id = item.Id,
                Title = item.Title,
                Description = item.Description,
                Instructor = item.Instructor,
                ClassCode = item.ClassCode,
                Notes = item.Notes
            };
            return dto;
        }

        public static void UpdateFromDto(this ClassInfo item, UpdateClassInfoDto dto)
        {
            // TODO: Update these fields to match the DTO.
            item.Title = dto.Title;
            item.Description = dto.Description;
            item.Instructor = dto.Instructor;
            item.ClassCode = dto.ClassCode;
            item.Notes = dto.Notes;
        }
    }
}