
export interface IEvent {
  type: string;
  label?: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}

export interface IEventExtended extends IEvent {
  offset: string;
  ispreviousDayEvent: boolean;
  isMonday: boolean;
}