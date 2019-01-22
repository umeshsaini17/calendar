import { Component, State, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import { ICalendarDate, ICalendarOptions, DateChangedEvent, IDateFooter, EventClickedEvent, MoreEventsClickedEvent, IHoliday } from '../../models';
import { DateHelper } from '../../utils/date.helper';
import moment from 'moment';
import { IEvent } from '../../models/event.model';
import { WeekDayType } from '../../enums';
import { EventHelper } from '../../utils/event.helper';

@Component({
  tag: 'te-calendar-full',
  styleUrl: 'calendar-full.css',
  shadow: false
})
export class CalendarFull {

  @Prop() dateFooters: Array<IDateFooter> = [];
  @Prop() events: Array<IEvent> = [];
  @Prop() holidays: Array<IHoliday> = [];
  @Prop({ mutable: true }) options: ICalendarOptions = {};
  @Prop() currentMonth: Date = new Date();
  @State() calendarDates: Array<ICalendarDate> = [];
  weekDays: Array<string>;

  @State() startCalendarDate: ICalendarDate = null;
  @State() endCalendarDate: ICalendarDate = null;

  @Event() dateSelected: EventEmitter<DateChangedEvent>;
  @Event() eventSelected: EventEmitter<EventClickedEvent>;
  @Event() moreEventsClicked: EventEmitter<MoreEventsClickedEvent>;

  componentWillLoad() {
    // this.initializeOptions(this.options);
    this.initCalendarDates();
  }

  private initCalendarDates() {
    this.calendarDates = DateHelper.getMonthDates(this.currentMonth, this.dateFooters);
    let days = moment.weekdays(true)
    days.push(days.shift());
    this.weekDays = days;
  }

  initializeOptions(options: ICalendarOptions) {
    this.options = Object.assign({
      allowMultiRangeSelect: false,
      weekendDays: [WeekDayType.Saturday, WeekDayType.Sunday],
      eventTypeLegends: []
    }, options);
    console.log(this.options);
  }

  @Watch('options')
  optionsChanged(newVal: ICalendarOptions) {
    this.initializeOptions(newVal);
  }

  @Watch('dateFooters')
  dateFootersChanged() {
    this.initCalendarDates();
  }

  @Watch('currentMonth')
  currentMonthChanged(newVal: Date, oldVal: Date) {
    if(newVal.getTime() !== oldVal.getTime()) {
      this.initCalendarDates();
    }
  }

  @Watch('events')
  eventsChanged() {
    this.calendarDates = this.calendarDates.map(x=> Object.assign(x, {isSelected: false}));
  }

  dateClicked(date: ICalendarDate) {
    this.calendarDates.forEach(x => {
      if (DateHelper.areDatesEqual(x.date, date.date)) {
        x.isSelected = !x.isSelected;
        this.startCalendarDate = this.endCalendarDate = x;
        if (x.isSelected) {
          console.log('dateClicked - ' + x.date);
          this.dateSelected.emit({ startDate: x.date, endDate: x.date });
        }
      } else if (!this.options.allowMultiRangeSelect) {
        x.isSelected = false;
        this.startCalendarDate = this.endCalendarDate = null;
      }
    });
    this.calendarDates = [... this.calendarDates];
  }

  eventClicked(evt: MouseEvent, event: IEvent) {
    evt.stopPropagation();
    this.eventSelected.emit({ event });
  }

  moreEventsClickedHandler(evt: MouseEvent, date: Date, events: Array<IEvent>) {
    evt.stopPropagation();
    this.moreEventsClicked.emit({ events, date });
  }

  dragStart(e, cd: ICalendarDate) {
    this.startCalendarDate = cd;
    var dragImgEl = document.createElement('span');
    dragImgEl.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');

    document.body.appendChild(dragImgEl);
    e.dataTransfer.setDragImage(dragImgEl, 0, 0);
  }

  dragOver(e, cd: ICalendarDate) {

    if (!this.startCalendarDate) {
      return;
    }
    if (!this.endCalendarDate || !DateHelper.areDatesEqual(cd.date, this.endCalendarDate.date)) {
      this.endCalendarDate = cd;
      this.calendarDates.forEach(d => {
        if (DateHelper.isLessThenOrEqual(this.startCalendarDate.date, d.date)
          && DateHelper.isLessThenOrEqual(d.date, this.endCalendarDate.date)) {
          d.isSelected = true;
        } else {
          d.isSelected = false;
        }
      });

      this.calendarDates = [... this.calendarDates];
    }
    e.preventDefault();
  }

  dragEnd() {
    let selectedDates = this.calendarDates.filter(x => x.isSelected).sort((x, y) => DateHelper.isLessThenOrEqual(x.date, y.date) ? -1 : 1);
    let first = selectedDates.shift();
    let last = selectedDates.pop();
    if (first && last) {
      console.log('dragEnd - ' + first.date);
      this.dateSelected.emit({ startDate: first.date, endDate: last.date });
    }
  }

  tileStyle(cd: ICalendarDate) {
    return 'date-tile' + ((!cd.isCurrentMonth) ? ' other-month' : '')
      + ((DateHelper.areDatesEqual(cd.date, new Date())) ? ' today' : '')
      + (cd.isSelected ? ' selected' : '')
      + (this.options.weekendDays && this.options.weekendDays.indexOf(DateHelper.getWeekDay(cd.date)) >= 0 ? ' week-end' : '');
  }

  getEventsLimit() {
    return this.dateFooters && this.dateFooters.length ? 3 : 4;
  }

  getDateHoliday(date: Date): IHoliday {
    return this.holidays.find(x => DateHelper.areDatesEqual(x.date, date));
  }

  render() {
    return (
      <div>
        <div class="header">
          {this.weekDays.map(wd => {
            return <div class="date-header-tile">{wd}</div>
          })}
        </div>
        <div class="dates">
          {
            this.calendarDates.map(cd => {
              let dateEvents = EventHelper.getDateEvents(cd.date, this.events, this.getEventsLimit());
              let holiday = this.getDateHoliday(cd.date);
              return (
                <div draggable={true} class={this.tileStyle(cd) + (holiday ? ' is-holiday' : '')}
                  onClick={() => this.dateClicked(cd)}
                  onDragOver={(e) => this.dragOver(e, cd)}
                  onDragStart={(e) => this.dragStart(e, cd)}
                  onDragEnd={() => this.dragEnd()}>
                  {(EventHelper.getDateExtendedEventsCount(cd.date, this.events, this.getEventsLimit()) >= 1) ?
                    <div onClick={(e) => this.moreEventsClickedHandler(e, cd.date, dateEvents)} class={'more-bar' + (cd.footerHtml ? ' hasFooter' : '')}><a href="#">+{EventHelper.getDateExtendedEventsCount(cd.date, this.events)} more</a></div>
                    : ''
                  }
                  {cd.footerHtml ?
                    <div class="footer" innerHTML={cd.footerHtml}>
                    </div>
                    : ''
                  }
                  <div class="tile-content">
                    <div class="tile-text">{cd.text}</div>
                    {holiday ? <div class="tile-holiday">{holiday.label}</div> : ''}
                    {dateEvents.map(e => {
                      if(e.ispreviousDayEvent && !e.isMonday) {
                        return '';
                      }
                      let diff = DateHelper.getDateCount(cd.date, e.endDate);
                      let legend = this.options.eventTypeLegends.find(etl => etl.type === e.type);
                      return (
                        <div class="event-bar" onClick={(evt) => { this.eventClicked(evt, e) }} style={{
                          width: 'calc(100%/7*' + diff + ' - ' + diff + '*2px - 25px)',
                          borderLeftColor: (legend ? legend.color : ''),
                          backgroundColor: (legend ? legend.bgColor : ''),
                          marginTop: e.offset
                        }}>
                          <span class="label">{e.label}</span>
                          <span class="desc">{e.description}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}
