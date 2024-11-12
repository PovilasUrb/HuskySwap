
using LightNap.Core.Api;

namespace LightNap.Core.ClassInfos.Request.Dto
{
    public class SearchClassInfosDto : PaginationRequestDtoBase
    {
        // TODO: Update to reflect which fields to include for searches.
        public string? Title { get; set; }
        public string? Instructor { get; set; }
        public string? ClassCode { get; set; }

    }
}