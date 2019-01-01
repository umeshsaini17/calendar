import { MomentInput } from 'moment';
import { ICalendarDate, IDateFooter } from "../models";
import { WeekDayType } from '../enums';
export declare class DateHelper {
    static getMonthDates(date: MomentInput, dateFooters?: Array<IDateFooter>): Array<ICalendarDate>;
    private static getDateRange;
    static getDateCount(startDate: Date, endDate: Date): number;
    static isCarryToNextWeek(startDate: Date, endDate: Date): boolean;
    static getNextMonday(date: Date): Date;
    static areDatesEqual(date1: Date, date2: Date): boolean;
    static isGreaterThenOrEqual(date1: Date, date2: Date): boolean;
    static isLessThenOrEqual(date1: Date, date2: Date): boolean;
    static getWeekDay(date: Date): WeekDayType;
}
