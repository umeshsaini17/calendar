
// TeCalendar: Custom Elements Define Library, ES Module/es2017 Target

import { defineCustomElement } from './te-calendar.core.js';
import {
  CalendarFull
} from './te-calendar.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, [
    CalendarFull
  ], opts);
}
