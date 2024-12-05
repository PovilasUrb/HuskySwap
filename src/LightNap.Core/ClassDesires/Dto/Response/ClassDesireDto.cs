namespace LightNap.Core.ClassDesires.Response.Dto
{
    public class ClassDesireDto
    {
        // TODO: Finalize which fields to include when returning this item.
        public int Id { get; set; }
        public string ClassInfoId { get; set; }
		public string UserId { get; set; }
		public bool IsActive { get; set; }
    }
}