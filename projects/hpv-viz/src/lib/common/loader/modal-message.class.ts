/**
 * Class for Modal Message
 */
import {MessageTypeEnum} from './message-type.enum';

export class Message {
  private content: string;
  private type: MessageTypeEnum;

  constructor(content: string, type: MessageTypeEnum) {
    this.content = content;
    this.type = type;
  }

  getContent(): string {
    return this.content;
  }
}
