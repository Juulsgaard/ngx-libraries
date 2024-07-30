import {inject, Injectable, NgZone} from '@angular/core';
import {NgxDragContext} from "../models/ngx-drag-context";
import {fromEvent, Subscription} from "rxjs";
import {MoveEvent, Position} from "../models/misc.models";

@Injectable({providedIn: 'root'})
export class NgxDragService {

  readonly zone = inject(NgZone);

  context?: NgxDragContext<unknown>;

  private eventSub?: Subscription;

  private startTouch() {
    this.eventSub?.unsubscribe();
    const sub = new Subscription();

    this.zone.runOutsideAngular(() => {
      sub.add(fromEvent<TouchEvent>(document, 'touchmove', {capture: true, passive: true})
        .subscribe(e => this.onMove(e)));
      sub.add(fromEvent<TouchEvent>(document, 'touchend', {capture: true, passive: true})
        .subscribe(e => this.onEnd(e)));
    });

    this.eventSub = sub;
  }

  private startMouse() {
    this.eventSub?.unsubscribe();
    const sub = new Subscription();

    this.zone.runOutsideAngular(() => {
      sub.add(fromEvent<MouseEvent>(document, 'mousemove', {capture: true, passive: true})
        .subscribe(e => this.onMove(e)));
      sub.add(fromEvent<MouseEvent>(document, 'mouseup', {capture: true, passive: true})
        .subscribe(e => this.onEnd(e)));
    });

    this.eventSub = sub;
  }

  private onMove(raw: MouseEvent | TouchEvent) {
    if (!this.context) return;
    const event = new MoveEvent(raw);

    this.context.updatePreview(event.position);
  }

  private onEnd(raw: MouseEvent | TouchEvent) {
    if (!this.context) return;
    const event = new MoveEvent(raw);

    this.context.dispose();
    this.context = undefined;
    console.log('Dropped', event.position);
  }

  startDrag<T>(
    element: HTMLElement,
    data: T, position: Position,
    firstEvent: MoveEvent,
    offset: Position
  ): NgxDragContext<T> {
    this.context?.dispose();

    const context = new NgxDragContext(element, data, firstEvent, offset);
    context.updatePreview(position);
    this.context = context;

    if (firstEvent.touch) {
      this.startTouch();
    } else {
      this.startMouse();
    }

    return context;
  }

  deregister(context: NgxDragContext<unknown>) {
    if (context !== this.context) {
      context.dispose();
      return;
    }

    this.context.dispose();
    this.context = undefined;
  }
}
