namespace LightNap.Core.Data.Entities
{
    public class ClassTime
    {
        public int Id { get; set; }
        public ClassInfo? ClassInfo { get; set; }
        public required string ClassInfoId { get; set; }
        public int Day { get; set; } // M1,T2,W3,Th4,F5
        public int StartTime {  get; set; } // 24 hr military time (0500)
        public int EndTime { get; set; } // 24 hr military time (0500)
    }
}
