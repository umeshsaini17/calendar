import { DateHelper } from '../../utils/date.helper';
import moment from 'moment';
import { WeekDayType } from '../../enums';
export class CalendarFull {
    constructor() {
        this.dateFooters = [];
        this.events = [];
        this.options = {};
        this.currentMonth = new Date();
        this.calendarDates = [];
        this.startCalendarDate = null;
        this.endCalendarDate = null;
    }
    componentWillLoad() {
        this.calendarDates = DateHelper.getMonthDates(this.currentMonth, this.dateFooters);
        let days = moment.weekdays(true);
        days.push(days.shift());
        this.weekDays = days;
    }
    initializeOptions(options) {
        this.options = Object.assign({
            allowMultiRangeSelect: false,
            weekendDays: [WeekDayType.Saturday, WeekDayType.Sunday],
            eventTypeLegends: []
        }, options);
        console.log(this.options);
    }
    optionsChanged(newVal) {
        this.initializeOptions(newVal);
    }
    calendarDatesChanged() {
    }
    dateFootersChanged(newVal) {
        console.log(newVal);
    }
    eventsChanged(newVal) {
        newVal.forEach(e => {
            let d = this.calendarDates.find(cd => DateHelper.areDatesEqual(cd.date, e.startDate));
            if (d) {
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
        });
    }
    dateClicked(date) {
        this.calendarDates.forEach(x => {
            if (DateHelper.areDatesEqual(x.date, date.date)) {
                x.isSelected = !x.isSelected;
                this.startCalendarDate = this.endCalendarDate = x;
                if (x.isSelected) {
                    this.dateSelected.emit({ startDate: x.date, endDate: x.date });
                }
            }
            else if (!this.options.allowMultiRangeSelect) {
                x.isSelected = false;
                this.startCalendarDate = this.endCalendarDate = null;
            }
        });
        this.calendarDates = [...this.calendarDates];
    }
    eventClicked(evt, event) {
        evt.stopPropagation();
        this.eventSelected.emit({ event });
    }
    dragStart(e, cd) {
        this.startCalendarDate = cd;
        var dragImgEl = document.createElement('span');
        dragImgEl.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');
        document.body.appendChild(dragImgEl);
        e.dataTransfer.setDragImage(dragImgEl, 0, 0);
    }
    dragOver(e, cd) {
        if (!this.startCalendarDate) {
            return;
        }
        if (!this.endCalendarDate || !DateHelper.areDatesEqual(cd.date, this.endCalendarDate.date)) {
            this.endCalendarDate = cd;
            this.calendarDates.forEach(d => {
                if (DateHelper.isLessThenOrEqual(this.startCalendarDate.date, d.date)
                    && DateHelper.isLessThenOrEqual(d.date, this.endCalendarDate.date)) {
                    d.isSelected = true;
                }
                else {
                    d.isSelected = false;
                }
            });
            this.calendarDates = [...this.calendarDates];
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
    tileStyle(cd) {
        return 'date-tile' + ((!cd.isCurrentMonth) ? ' other-month' : '')
            + (cd.isSelected ? ' selected' : '')
            + (this.options.weekendDays && this.options.weekendDays.indexOf(DateHelper.getWeekDay(cd.date)) >= 0 ? ' week-end' : '');
    }
    render() {
        return (h("div", null,
            h("div", { class: "header" }, this.weekDays.map(wd => {
                return h("div", { class: "date-header-tile" }, wd);
            })),
            h("div", { class: "dates" }, this.calendarDates.map(cd => {
                return (h("div", { draggable: true, class: this.tileStyle(cd), onClick: () => this.dateClicked(cd), onDragOver: (e) => this.dragOver(e, cd), onDragStart: (e) => this.dragStart(e, cd), onDragEnd: () => this.dragEnd() },
                    cd.footerHtml ?
                        h("div", { class: "footer", innerHTML: cd.footerHtml })
                        : '',
                    h("div", { class: "content" },
                        h("div", null, cd.text),
                        cd.events.map(e => {
                            let diff = DateHelper.getDateCount(cd.date, e.endDate);
                            let legend = this.options.eventTypeLegends.find(etl => etl.type === e.type);
                            return (h("div", { class: "event-bar", onClick: (evt) => { this.eventClicked(evt, e); }, style: {
                                    width: 'calc(100%/7*' + diff + ' - ' + diff + '*2px - 25px)',
                                    borderLeftColor: (legend ? legend.color : ''),
                                    backgroundColor: (legend ? legend.bgColor : '')
                                } },
                                h("span", { class: "label" }, e.label),
                                h("span", { class: "desc" }, e.description)));
                        }))));
            }))));
    }
    static get is() { return "te-calendar-full"; }
    static get properties() { return {
        "calendarDates": {
            "state": true,
            "watchCallbacks": ["calendarDatesChanged"]
        },
        "currentMonth": {
            "type": "Any",
            "attr": "current-month"
        },
        "dateFooters": {
            "type": "Any",
            "attr": "date-footers",
            "watchCallbacks": ["dateFootersChanged"]
        },
        "endCalendarDate": {
            "state": true
        },
        "events": {
            "type": "Any",
            "attr": "events",
            "watchCallbacks": ["eventsChanged"]
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "mutable": true,
            "watchCallbacks": ["optionsChanged"]
        },
        "startCalendarDate": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "dateSelected",
            "method": "dateSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "eventSelected",
            "method": "eventSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:te-calendar-full:**/"; }
}
