namespace LightNap.Core.Data.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public TradeRequest? TradeRequest { get; set; }
        public int TradeRequestId { get; set; }
        public required string Content { get; set; }
        public ApplicationUser? SendingUser {  get; set; }
        public required string SendingUserId { get; set; }
        public DateTimeOffset Timestamp { get; set; }
    }
}
