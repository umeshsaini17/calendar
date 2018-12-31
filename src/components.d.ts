/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';


import {
  DateChangedEvent,
  ICalendarOptions,
  IDateFooter,
} from './models';
import {
  IEvent,
} from './models/event.model';
import {
  EventEmitter,
} from '@stencil/core';


export namespace Components {

  interface TeCalendarFull {
    'dateFooters': Array<IDateFooter>;
    'events': Array<IEvent>;
    'options': ICalendarOptions;
  }
  interface TeCalendarFullAttributes extends StencilHTMLAttributes {
    'dateFooters'?: Array<IDateFooter>;
    'events'?: Array<IEvent>;
    'onDateSelected'?: (event: CustomEvent<DateChangedEvent>) => void;
    'options'?: ICalendarOptions;
  }

  interface TeDateTile {}
  interface TeDateTileAttributes extends StencilHTMLAttributes {}
}

declare global {
  interface StencilElementInterfaces {
    'TeCalendarFull': Components.TeCalendarFull;
    'TeDateTile': Components.TeDateTile;
  }

  interface StencilIntrinsicElements {
    'te-calendar-full': Components.TeCalendarFullAttributes;
    'te-date-tile': Components.TeDateTileAttributes;
  }


  interface HTMLTeCalendarFullElement extends Components.TeCalendarFull, HTMLStencilElement {}
  var HTMLTeCalendarFullElement: {
    prototype: HTMLTeCalendarFullElement;
    new (): HTMLTeCalendarFullElement;
  };

  interface HTMLTeDateTileElement extends Components.TeDateTile, HTMLStencilElement {}
  var HTMLTeDateTileElement: {
    prototype: HTMLTeDateTileElement;
    new (): HTMLTeDateTileElement;
  };

  interface HTMLElementTagNameMap {
    'te-calendar-full': HTMLTeCalendarFullElement
    'te-date-tile': HTMLTeDateTileElement
  }

  interface ElementTagNameMap {
    'te-calendar-full': HTMLTeCalendarFullElement;
    'te-date-tile': HTMLTeDateTileElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}