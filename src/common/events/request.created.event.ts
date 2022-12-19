import { INewRequestCreated } from '../../modules/notification/interfaces/notification.interface';

export class RequestCreatedEvent implements INewRequestCreated {
  requestId: string;
  tags: string[];
  description: string;
  link: string;
  constructor(public message: { [k: string]: any }) {
    if (message && message?.requestId) {
      this.requestId = message.requestId;
    }
    if (message && message?.tags) {
      this.tags = message.tags;
    }
    if (message && message?.description) {
      this.description = message.description;
    }
    if (message && message?.link) {
      this.link = message.link;
    }
  }
}
