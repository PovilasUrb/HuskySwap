namespace LightNap.Core.Data.Entities
{
    public class ClassInfo
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Instructor { get; set; }
        public required string ClassCode { get; set; }
        public required string Notes { get; set; }
    }
}
