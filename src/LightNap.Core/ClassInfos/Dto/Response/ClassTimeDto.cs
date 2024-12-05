namespace LightNap.Core.ClassInfos.Response.Dto
{
    public class ClassTimeDto
    {
        // TODO: Finalize which fields to include when returning this item.
        public int Id { get; set; }
        public int Day { get; set; } // M1,T2,W3,Th4,F5
        public int StartTime { get; set; } // 24 hr military time (0500)
        public int EndTime { get; set; } // 24 hr military time (0500)
    }
}
