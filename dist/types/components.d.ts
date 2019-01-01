/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import './stencil.core';


import {
  DateChangedEvent,
  EventClickedEvent,
  ICalendarOptions,
  IDateFooter,
} from './models';
import {
  IEvent,
} from './models/event.model';
import {
  EventEmitter,
} from './stencil.core';


export namespace Components {

  interface TeCalendarFull {
    'currentMonth': Date;
    'dateFooters': Array<IDateFooter>;
    'events': Array<IEvent>;
    'options': ICalendarOptions;
  }
  interface TeCalendarFullAttributes extends StencilHTMLAttributes {
    'currentMonth'?: Date;
    'dateFooters'?: Array<IDateFooter>;
    'events'?: Array<IEvent>;
    'onDateSelected'?: (event: CustomEvent<DateChangedEvent>) => void;
    'onEventSelected'?: (event: CustomEvent<EventClickedEvent>) => void;
    'options'?: ICalendarOptions;
  }
}

declare global {
  interface StencilElementInterfaces {
    'TeCalendarFull': Components.TeCalendarFull;
  }

  interface StencilIntrinsicElements {
    'te-calendar-full': Components.TeCalendarFullAttributes;
  }


  interface HTMLTeCalendarFullElement extends Components.TeCalendarFull, HTMLStencilElement {}
  var HTMLTeCalendarFullElement: {
    prototype: HTMLTeCalendarFullElement;
    new (): HTMLTeCalendarFullElement;
  };

  interface HTMLElementTagNameMap {
    'te-calendar-full': HTMLTeCalendarFullElement
  }

  interface ElementTagNameMap {
    'te-calendar-full': HTMLTeCalendarFullElement;
  }


}