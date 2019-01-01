import { DateHelper } from "./date.helper";
import { WeekDayType } from "../enums";
export class EventHelper {
    static getDateEvents(date, events, limit = 3) {
        let dateEvents = events.filter(e => DateHelper.isLessThenOrEqual(e.startDate, date) && DateHelper.isLessThenOrEqual(date, e.endDate))
            .sort((x, y) => DateHelper.isLessThenOrEqual(x.startDate, y.startDate) ? -1 : 1)
            .map((x, i) => {
            return Object.assign({}, x, { offset: (i * 17 + 1) + 'px', ispreviousDayEvent: !DateHelper.areDatesEqual(date, x.startDate), isMonday: DateHelper.getWeekDay(date) === WeekDayType.Monday });
        });
        return dateEvents.splice(0, limit);
    }
    static getDateExtendedEventsCount(date, events, limit = 3) {
        let eventsCount = events.filter(e => DateHelper.isLessThenOrEqual(e.startDate, date) && DateHelper.isLessThenOrEqual(date, e.endDate)).length;
        return eventsCount - limit;
    }
}
