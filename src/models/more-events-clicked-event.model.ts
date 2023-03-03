import { IEvent } from "./event.model";

export interface MoreEventsClickedEvent {
  events: IEvent[];
  date: Date;
}
