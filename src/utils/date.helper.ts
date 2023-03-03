import moment, { MomentInput } from "moment";
import { ICalendarDate, IDateFooter } from "../models";

export const DateHelper = {
  getMonthDates: (date: MomentInput, dateFooters: IDateFooter[] = []) => {
    let mDate = moment(date);
    let sm = moment(date).startOf("month");
    let startDate = sm.day(sm.day() ? 1 : -6); // If Start of Day is Sunday (0), then get startDate as this week Monday (-6)
    let em = moment(date).endOf("month");
    let endDate = em.day(em.day() ? 7 : 0); // If End of Month is Sunday (0), then take that as end Date
    let month = mDate.month();

    let dates = DateHelper.getDateRange(startDate.toDate(), endDate.toDate());
    return dates.map<ICalendarDate>((x) => {
      let m = moment(x);
      let footerHtml = null;
      if (dateFooters && dateFooters.length) {
        let foundFooter = dateFooters.find((df) =>
          DateHelper.areDatesEqual(df.date, x)
        );
        if (foundFooter && foundFooter.innerHtml) {
          footerHtml = foundFooter.innerHtml;
        }
      }
      return {
        date: x,
        isCurrentMonth: m.month() === month,
        text: m.format("D"),
        isSelected: false,
        events: [],
        footerHtml: footerHtml,
      };
    });
  },
  getDateRange: (startDate: Date, endDate: Date) => {
    var dates: Date[] = [];

    var currDate = moment(startDate).startOf("day");
    var lastDate = moment(endDate).startOf("day");
    dates.push(currDate.clone().toDate());

    while (currDate.add(1, "days").diff(lastDate) <= 0) {
      dates.push(currDate.clone().toDate());
    }

    return dates;
  },
  getDateCount: (startDate: Date, endDate: Date) => {
    const startDay = moment(startDate);
    const splitDay = moment(startDate).day(7);
    const endDay = moment(endDate);

    const diffToEnd = endDay.diff(startDay, "days");
    const diffToSunday = splitDay.diff(startDay, "days");
    if (diffToEnd < diffToSunday) {
      return diffToEnd + 1;
    }
    return diffToSunday + 1;
  },
  isCarryToNextWeek: (startDate: Date, endDate: Date) => {
    const startDay = moment(startDate);
    const splitDay = moment(startDate).day(7);
    const endDay = moment(endDate);

    const diffToEnd = endDay.diff(startDay, "days");
    const diffToSunday = splitDay.diff(startDay, "days");
    return diffToSunday < diffToEnd;
  },
  getNextMonday: (date: Date) => {
    return moment(date).day(8).toDate();
  },
  areDatesEqual: (date1: Date, date2: Date) => {
    return (
      moment(date1).format("DDMMYYYY") === moment(date2).format("DDMMYYYY")
    );
  },
  isGreaterThenOrEqual: (date1: Date, date2: Date) => {
    return moment(date1).diff(date2) >= 0;
  },
  isLessThenOrEqual: (date1: Date, date2: Date) => {
    return moment(date1).diff(date2) <= 0;
  },
  getWeekDay: (date: Date) => {
    return moment(date).weekday();
  },
};
