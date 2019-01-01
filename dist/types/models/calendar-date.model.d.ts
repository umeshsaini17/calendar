import { IEvent } from "./event.model";
export interface ICalendarDate {
    date: Date;
    isCurrentMonth: boolean;
    text: string;
    isSelected?: boolean;
    events?: Array<IEvent>;
    footerHtml?: string;
}
