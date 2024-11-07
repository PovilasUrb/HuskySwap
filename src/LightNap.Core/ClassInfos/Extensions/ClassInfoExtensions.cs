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
            return new ClassInfo() {
                Title = dto.Title,
                Description = dto.Description,
                Instructor = dto.Instructor,
                ClassCode = dto.ClassCode,
                Notes = dto.Notes
            };
        }

        public static ClassInfoDto ToDto(this ClassInfo item)
        {
            // TODO: Update these fields to match the DTO.
            var dto = new ClassInfoDto();
            dto.Id = item.Id;
            dto.Title = item.Title;
			dto.Description = item.Description;
			dto.Instructor = item.Instructor;
			dto.ClassCode = item.ClassCode;
			dto.Notes = item.Notes;
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