import { Component, State, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import { ICalendarDate, ICalendarOptions, DateChangedEvent, IDateFooter, EventClickedEvent } from '../../models';
import { DateHelper } from '../../utils/date.helper';
import moment from 'moment';
import { IEvent } from '../../models/event.model';
import { WeekDayType } from '../../enums';

@Component({
  tag: 'te-calendar-full',
  styleUrl: 'calendar-full.css',
  shadow: false
})
export class CalendarFull {

  @Prop() dateFooters: Array<IDateFooter> = [];
  @Prop() events: Array<IEvent> = [];
  @Prop({ mutable: true }) options: ICalendarOptions = {};
  @Prop() currentMonth: Date = new Date();
  @State() calendarDates: Array<ICalendarDate> = [];
  weekDays: Array<string>;

  @State() startCalendarDate: ICalendarDate = null;
  @State() endCalendarDate: ICalendarDate = null;

  @Event() dateSelected: EventEmitter<DateChangedEvent>;
  @Event() eventSelected: EventEmitter<EventClickedEvent>;

  // @Listen('dateSelected')
  // dateSelectedHandler(event: CustomEvent) {

  // }

  componentWillLoad() {
    // this.initializeOptions(this.options);
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
    // console.log(newVal);
  }

  @Watch('calendarDates')
  calendarDatesChanged(/*newVal: Array<ICalendarDate>*/) {
    // console.log(newVal);
  }

  @Watch('dateFooters')
  dateFootersChanged(newVal: Array<ICalendarDate>) {
    console.log(newVal);
  }

  @Watch('events')
  eventsChanged(newVal: Array<IEvent>) {
    newVal.forEach(e => {
      let d = this.calendarDates.find(cd => DateHelper.areDatesEqual(cd.date, e.startDate));
      if (d) {
        //TODO: If already available event, then update.
        d.events.push(e);
        let startDate = new Date(e.startDate.getTime());
        while (DateHelper.isCarryToNextWeek(startDate, e.endDate)) {
          let mon = DateHelper.getNextMonday(startDate);
          let cdMon = this.calendarDates.find(d => DateHelper.areDatesEqual(d.date, mon));
          if (cdMon) {
            cdMon.events.push(e);
          }
          startDate = mon;
        }
      }
    })
  }

  dateClicked(date: ICalendarDate) {
    this.calendarDates.forEach(x => {
      if (DateHelper.areDatesEqual(x.date, date.date)) {
        x.isSelected = !x.isSelected;
        this.startCalendarDate = this.endCalendarDate = x;
        if (x.isSelected) {
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
      this.dateSelected.emit({ startDate: first.date, endDate: last.date });
    }
  }

  tileStyle(cd: ICalendarDate) {
    return 'date-tile' + ((!cd.isCurrentMonth) ? ' other-month' : '')
      + (cd.isSelected ? ' selected' : '')
      + (this.options.weekendDays && this.options.weekendDays.indexOf(DateHelper.getWeekDay(cd.date)) >= 0 ? ' week-end' : '');
  }

  // dragEnter(e) {
  //   console.log(e);
  // }

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
              return (
                <div draggable={true} class={this.tileStyle(cd)}
                  onClick={() => this.dateClicked(cd)}
                  onDragOver={(e) => this.dragOver(e, cd)}
                  onDragStart={(e) => this.dragStart(e, cd)}
                  onDragEnd={() => this.dragEnd()}>
                  {cd.footerHtml ?
                    <div class="footer" innerHTML={cd.footerHtml}>
                    </div>
                    : ''
                  }
                  <div class="content">
                    <div>{cd.text}</div>
                    {cd.events.map(e => {
                      let diff = DateHelper.getDateCount(cd.date, e.endDate);
                      let legend = this.options.eventTypeLegends.find(etl => etl.type === e.type);
                      return (
                        <div class="event-bar" onClick={(evt) => { this.eventClicked(evt, e) }} style={{
                          width: 'calc(100%/7*' + diff + ' - ' + diff + '*2px - 25px)',
                          borderLeftColor: (legend ? legend.color : ''),
                          backgroundColor: (legend ? legend.bgColor : '')
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
