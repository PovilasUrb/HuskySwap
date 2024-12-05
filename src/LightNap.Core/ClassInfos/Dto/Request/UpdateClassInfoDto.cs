

using LightNap.Core.Data.Entities;

namespace LightNap.Core.ClassInfos.Request.Dto
{
    public class UpdateClassInfoDto
    {
        // TODO: Update which fields to include when creating this item.
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Instructor { get; set; }
        public required string Notes { get; set; }
    }
}