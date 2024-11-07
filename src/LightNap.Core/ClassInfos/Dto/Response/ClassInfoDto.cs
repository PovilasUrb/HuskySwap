namespace LightNap.Core.ClassInfos.Response.Dto
{
    public class ClassInfoDto
    {
        // TODO: Finalize which fields to include when returning this item.
        public int Id { get; set; }
        public string Title { get; set; }
		public string Description { get; set; }
		public string Instructor { get; set; }
		public string ClassCode { get; set; }
		public string Notes { get; set; }
    }
}