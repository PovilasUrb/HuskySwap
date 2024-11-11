

namespace LightNap.Core.ClassInfos.Response.Dto
{
    public class ClassInfoDto
    {
        // TODO: Finalize which fields to include when returning this item.
		public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Instructor { get; set; }
        public required string ClassCode { get; set; }
        public required string Notes { get; set; }
    }
}
