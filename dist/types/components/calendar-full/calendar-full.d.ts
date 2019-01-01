import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { ICalendarDate, ICalendarOptions, DateChangedEvent, IDateFooter, EventClickedEvent } from '../../models';
import { IEvent } from '../../models/event.model';
export declare class CalendarFull {
    dateFooters: Array<IDateFooter>;
    events: Array<IEvent>;
    options: ICalendarOptions;
    currentMonth: Date;
    calendarDates: Array<ICalendarDate>;
    weekDays: Array<string>;
    startCalendarDate: ICalendarDate;
    endCalendarDate: ICalendarDate;
    dateSelected: EventEmitter<DateChangedEvent>;
    eventSelected: EventEmitter<EventClickedEvent>;
    componentWillLoad(): void;
    initializeOptions(options: ICalendarOptions): void;
    optionsChanged(newVal: ICalendarOptions): void;
    eventsChanged(): void;
    dateClicked(date: ICalendarDate): void;
    eventClicked(evt: MouseEvent, event: IEvent): void;
    dragStart(e: any, cd: ICalendarDate): void;
    dragOver(e: any, cd: ICalendarDate): void;
    dragEnd(): void;
    tileStyle(cd: ICalendarDate): string;
    getEventsLimit(): 3 | 4;
    render(): JSX.Element;
}
