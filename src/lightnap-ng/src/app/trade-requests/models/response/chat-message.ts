export interface ChatMessage {
  // TODO: Update these fields to match the server's CreateTradeRequestDto.
  id: number;
  content: string;
  sendingUserId: string;
  timestamp: Date;
}
