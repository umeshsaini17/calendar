import { IEvent, IEventExtended } from "../models";
import { DateHelper } from "./date.helper";
import { WeekDayType } from "../enums";

export class EventHelper {
  public static getDateEvents(date: Date, events: Array<IEvent>, limit: number = 3): Array<IEventExtended> {
    let dateEvents = events.filter(e => DateHelper.isLessThenOrEqual(e.startDate, date) && DateHelper.isLessThenOrEqual(date, e.endDate))
    .sort((x, y) => DateHelper.isLessThenOrEqual(x.startDate, y.startDate) ? -1 : 1)
    .map((x, i) => {
      return <IEventExtended>{...x, 
        offset: (i*17+1) + 'px', 
        ispreviousDayEvent: !DateHelper.areDatesEqual(date, x.startDate),
        isMonday: DateHelper.getWeekDay(date) === WeekDayType.Monday
      }
    });
    return dateEvents.splice(0, limit);
  }

  public static getDateExtendedEventsCount(date: Date, events: Array<IEvent>, limit: number = 3): number {
    let eventsCount = events.filter(e => DateHelper.isLessThenOrEqual(e.startDate, date) && DateHelper.isLessThenOrEqual(date, e.endDate)).length;
    return eventsCount - limit;
    
  }
}