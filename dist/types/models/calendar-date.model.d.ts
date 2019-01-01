export interface ICalendarDate {
    date: Date;
    isCurrentMonth: boolean;
    text: string;
    isSelected?: boolean;
    footerHtml?: string;
}
