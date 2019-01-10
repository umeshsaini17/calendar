import { DateHelper } from '../../utils/date.helper';
import moment from 'moment';
import { WeekDayType } from '../../enums';
import { EventHelper } from '../../utils/event.helper';
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
        this.initCalendarDates();
    }
    initCalendarDates() {
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
    currentMonthChanged(newVal, oldVal) {
        if (newVal.getTime() !== oldVal.getTime()) {
            this.initCalendarDates();
        }
    }
    eventsChanged() {
        this.calendarDates = this.calendarDates.map(x => Object.assign(x, { isSelected: false }));
    }
    dateClicked(date) {
        this.calendarDates.forEach(x => {
            if (DateHelper.areDatesEqual(x.date, date.date)) {
                x.isSelected = !x.isSelected;
                this.startCalendarDate = this.endCalendarDate = x;
                if (x.isSelected) {
                    console.log('dateClicked - ' + x.date);
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
    moreEventsClickedHandler(evt, date, events) {
        evt.stopPropagation();
        this.moreEventsClicked.emit({ events, date });
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
            console.log('dragEnd - ' + first.date);
            this.dateSelected.emit({ startDate: first.date, endDate: last.date });
        }
    }
    tileStyle(cd) {
        return 'date-tile' + ((!cd.isCurrentMonth) ? ' other-month' : '')
            + ((DateHelper.areDatesEqual(cd.date, new Date())) ? ' today' : '')
            + (cd.isSelected ? ' selected' : '')
            + (this.options.weekendDays && this.options.weekendDays.indexOf(DateHelper.getWeekDay(cd.date)) >= 0 ? ' week-end' : '');
    }
    getEventsLimit() {
        return this.dateFooters && this.dateFooters.length ? 3 : 4;
    }
    render() {
        return (h("div", null,
            h("div", { class: "header" }, this.weekDays.map(wd => {
                return h("div", { class: "date-header-tile" }, wd);
            })),
            h("div", { class: "dates" }, this.calendarDates.map(cd => {
                let dateEvents = EventHelper.getDateEvents(cd.date, this.events, this.getEventsLimit());
                return (h("div", { draggable: true, class: this.tileStyle(cd), onClick: () => this.dateClicked(cd), onDragOver: (e) => this.dragOver(e, cd), onDragStart: (e) => this.dragStart(e, cd), onDragEnd: () => this.dragEnd() },
                    (EventHelper.getDateExtendedEventsCount(cd.date, this.events, this.getEventsLimit()) >= 1) ?
                        h("div", { onClick: (e) => this.moreEventsClickedHandler(e, cd.date, dateEvents), class: 'more-bar' + (cd.footerHtml ? ' hasFooter' : '') },
                            h("a", { href: "#" },
                                "+",
                                EventHelper.getDateExtendedEventsCount(cd.date, this.events),
                                " more"))
                        : '',
                    cd.footerHtml ?
                        h("div", { class: "footer", innerHTML: cd.footerHtml })
                        : '',
                    h("div", { class: "tile-content" },
                        h("div", { class: "tile-text" }, cd.text),
                        dateEvents.map(e => {
                            if (e.ispreviousDayEvent && !e.isMonday) {
                                return '';
                            }
                            let diff = DateHelper.getDateCount(cd.date, e.endDate);
                            let legend = this.options.eventTypeLegends.find(etl => etl.type === e.type);
                            return (h("div", { class: "event-bar", onClick: (evt) => { this.eventClicked(evt, e); }, style: {
                                    width: 'calc(100%/7*' + diff + ' - ' + diff + '*2px - 25px)',
                                    borderLeftColor: (legend ? legend.color : ''),
                                    backgroundColor: (legend ? legend.bgColor : ''),
                                    marginTop: e.offset
                                } },
                                h("span", { class: "label" }, e.label),
                                h("span", { class: "desc" }, e.description)));
                        }))));
            }))));
    }
    static get is() { return "te-calendar-full"; }
    static get properties() { return {
        "calendarDates": {
            "state": true
        },
        "currentMonth": {
            "type": "Any",
            "attr": "current-month",
            "watchCallbacks": ["currentMonthChanged"]
        },
        "dateFooters": {
            "type": "Any",
            "attr": "date-footers"
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
        }, {
            "name": "moreEventsClicked",
            "method": "moreEventsClicked",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:te-calendar-full:**/"; }
}
