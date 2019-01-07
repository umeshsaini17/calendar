import moment from 'moment';
export class DateHelper {
    static getMonthDates(date, dateFooters = []) {
        let mDate = moment(date);
        let startDate = moment(date).startOf('month').day(1);
        let endDate = moment(date).endOf('month').day(7);
        let month = mDate.month();
        let dates = this.getDateRange(startDate.toDate(), endDate.toDate());
        return dates.map(x => {
            let m = moment(x);
            let footerHtml = null;
            if (dateFooters && dateFooters.length) {
                let foundFooter = dateFooters.find(df => DateHelper.areDatesEqual(df.date, x));
                if (foundFooter && foundFooter.innerHtml) {
                    footerHtml = foundFooter.innerHtml;
                }
            }
            return {
                date: x,
                isCurrentMonth: m.month() === month,
                text: m.format('D'),
                isSelected: false,
                events: [],
                footerHtml: footerHtml
            };
        });
    }
    static getDateRange(startDate, endDate) {
        var dates = [];
        var currDate = moment(startDate).startOf('day');
        var lastDate = moment(endDate).startOf('day');
        dates.push(currDate.clone().toDate());
        while (currDate.add(1, 'days').diff(lastDate) <= 0) {
            dates.push(currDate.clone().toDate());
        }
        return dates;
    }
    static getDateCount(startDate, endDate) {
        const startDay = moment(startDate);
        const splitDay = moment(startDate).day(7);
        const endDay = moment(endDate);
        const diffToEnd = endDay.diff(startDay, 'days');
        const diffToSunday = splitDay.diff(startDay, 'days');
        if (diffToEnd < diffToSunday) {
            return diffToEnd + 1;
        }
        return diffToSunday + 1;
    }
    static isCarryToNextWeek(startDate, endDate) {
        const startDay = moment(startDate);
        const splitDay = moment(startDate).day(7);
        const endDay = moment(endDate);
        const diffToEnd = endDay.diff(startDay, 'days');
        const diffToSunday = splitDay.diff(startDay, 'days');
        return diffToSunday < diffToEnd;
    }
    static getNextMonday(date) {
        return moment(date).day(8).toDate();
    }
    static areDatesEqual(date1, date2) {
        return moment(date1).format('DDMMYYYY') === moment(date2).format('DDMMYYYY');
    }
    static isGreaterThenOrEqual(date1, date2) {
        return moment(date1).diff(date2) >= 0;
    }
    static isLessThenOrEqual(date1, date2) {
        return moment(date1).diff(date2) <= 0;
    }
    static getWeekDay(date) {
        return moment(date).weekday();
    }
}
