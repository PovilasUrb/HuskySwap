

namespace LightNap.Core.ClassUsers.Response.Dto
{
    public class ClassUserDto
    {
        // TODO: Finalize which fields to include when returning this item.
		public int Id { get; set; }
        public int ClassId { get; set; }
        public string UserId { get; set; }
        public bool IsActive { get; set; }
    }
}
