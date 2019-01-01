import { IEvent, IEventExtended } from "../models";
export declare class EventHelper {
    static getDateEvents(date: Date, events: Array<IEvent>, limit?: number): Array<IEventExtended>;
    static getDateExtendedEventsCount(date: Date, events: Array<IEvent>, limit?: number): number;
}
