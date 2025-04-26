/**
 * Message Types Enum
 */
export const MessageType = {
  USER: 'user',
  BOT: 'bot'
};

/**
 * Message Model Class
 */
export class Message {
  /**
   * Create a new message
   * @param {string} content - The message content
   * @param {string} type - The message type (user/bot)
   */
  constructor(content, type = MessageType.USER) {
    this.content = content;
    this.type = type;
    this.timestamp = new Date();
  }

  /**
   * Create a user message
   * @param {string} content - The message content
   * @returns {Message} A new user message
   */
  static createUserMessage(content) {
    return new Message(content, MessageType.USER);
  }

  /**
   * Create a bot message
   * @param {string} content - The message content
   * @returns {Message} A new bot message
   */
  static createBotMessage(content) {
    return new Message(content, MessageType.BOT);
  }
} 