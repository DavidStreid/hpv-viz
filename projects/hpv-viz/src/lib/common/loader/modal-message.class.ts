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

  public getContent(): string {
    return this.content;
  }
  public isType(query: MessageTypeEnum): boolean {
    return query === this.type;
  }
}
