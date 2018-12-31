import { WeekDayType } from "../enums";

export interface ICalendarOptions {
  allowMultiRangeSelect?: boolean;
  weekendDays?: Array<WeekDayType>;
  eventTypeLegends?: Array<IEventTypeLegend>;
}

export interface IEventTypeLegend {
  type: string;
  color: string;
  bgColor?: string;
  fullBackgroundColor?: string;
  hasFullBackground?: boolean;
}