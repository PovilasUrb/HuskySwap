
import { ChatMessage } from "../models/response/chat-message";

export class ChatMessageHelper {
  static rehydrate(chatMessage: ChatMessage) {
    if (chatMessage.timestamp) {
      chatMessage.timestamp = new Date(chatMessage.timestamp);
    }
  }
}
