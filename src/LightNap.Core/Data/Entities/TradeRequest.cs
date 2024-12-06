namespace LightNap.Core.Data.Entities
{
    public class TradeRequest
    {
        public int Id { get; set; }
        public ClassUser? RequestingClassUser { get; set; }
        public int RequestingClassUserId {  get; set; }
        public ClassUser? TargetClassUser { get; set; }
        public int TargetClassUserId { get; set; }
        public required TradeRequestStatus Status { get; set; }
        public ICollection<ChatMessage>? ChatMessages { get; set; }
        public required string Notes { get; set; }
    }
}
