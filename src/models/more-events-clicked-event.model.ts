import { IEvent } from "./event.model";

export interface MoreEventsClickedEvent {
  events: Array<IEvent>;
  date: Date;
}