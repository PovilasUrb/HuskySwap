namespace LightNap.Core.TradeRequests.Response.Dto
{
    public class ChatMessageDto
    {
        // TODO: Finalize which fields to include when returning this item.
        public int Id { get; set; }
        public required string Content { get; set; }
        public required string SendingUserId { get; set; }
        public DateTimeOffset Timestamp { get; set; }
    }
}
