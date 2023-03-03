import { IEvent, IEventExtended } from "../models";
import { DateHelper } from "./date.helper";
import { WeekDayType } from "../enums";

export const EventHelper = {
  getDateEvents(
    date: Date,
    events: IEvent[],
    limit: number = 3
  ): IEventExtended[] {
    let dateEvents = events
      .filter(
        (e) =>
          DateHelper.isLessThenOrEqual(e.startDate, date) &&
          DateHelper.isLessThenOrEqual(date, e.endDate)
      )
      .sort((x, y) =>
        DateHelper.isLessThenOrEqual(x.startDate, y.startDate) ? -1 : 1
      )
      .map((x, i) => {
        return <IEventExtended>{
          ...x,
          offset: i * 17 + 1 + "px",
          ispreviousDayEvent: !DateHelper.areDatesEqual(date, x.startDate),
          isMonday: DateHelper.getWeekDay(date) === WeekDayType.Monday,
        };
      });
    return dateEvents.splice(0, limit);
  },
  getDateExtendedEventsCount(date: Date, events: IEvent[], limit: number = 3) {
    let eventsCount = events.filter(
      (e) =>
        DateHelper.isLessThenOrEqual(e.startDate, date) &&
        DateHelper.isLessThenOrEqual(date, e.endDate)
    ).length;
    return eventsCount - limit;
  },
};
