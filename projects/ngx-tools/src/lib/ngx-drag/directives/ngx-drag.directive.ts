import {
  booleanAttribute, Directive, effect, ElementRef, inject, input, InputSignal, InputSignalWithTransform, NgZone, output
} from '@angular/core';
import {NgxDragContext, NgxDragStartContext} from "../models/ngx-drag-context";
import {NgxDragService} from "../services/ngx-drag.service";
import {combineLatest, fromEvent, Observable, of, skip, startWith, timer} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter, first, map} from "rxjs/operators";
import {Loading} from "@juulsgaard/rxjs-tools";
import {MoveEvent, Position} from "../models/misc.models";

@Directive({
  selector: '[ngxDrag]',
  host: {'[class.ngx-drag]': 'true'}
})
export class NgxDragDirective<T> {

  static readonly MOVE_THRESHOLD = 3;

  private readonly service = inject(NgxDragService);
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly zone = inject(NgZone);

  readonly dragData: InputSignal<T | undefined> = input<T>();
  readonly disableDrag: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly dragDelay = input(0);

  readonly dragStart = output<NgxDragStartContext<T>>();
  readonly dragEnd = output<NgxDragContext<T>>();

  private context?: NgxDragContext<T>;

  get dragging(): boolean {
    return !!this.context?.dragging
  }

  constructor() {
    effect(() => this.element.classList.toggle('ngx-drag-disabled', this.disableDrag()));
    effect(() => this.element.style.setProperty('--ngx-drag-delay', this.dragDelay()));

    this.zone.runOutsideAngular(() => {
      fromEvent<MouseEvent>(this.element, 'mousedown').pipe(takeUntilDestroyed()).subscribe(e => this.start(e));
      fromEvent<TouchEvent>(this.element, 'touchstart').pipe(takeUntilDestroyed()).subscribe(e => this.start(e));
    });
  }

  private start(rawEvent: MouseEvent | TouchEvent) {
    const event = new MoveEvent(rawEvent);

    if (this.disableDrag()) return;
    if (this.dragging || this.waitingStart.loading) return;

    const elementRect = this.element.getBoundingClientRect();
    const offset: Position = {x: event.position.x - elementRect.left, y: event.position.y - elementRect.top};

    this.awaitDragStart(event, offset);
  }

  //<editor-fold desc="Delayed start">
  private waitingStart = Loading.Empty();

  private awaitDragStart(event: MoveEvent, offset: Position) {

    const start$ = event.touch ?
      this.getDragStart$(
        fromEvent<MouseEvent>(document, 'touchmove', {passive: true, capture: true}),
        fromEvent<MouseEvent>(document, 'touchend', {passive: true, capture: true}),
        event.position
      ) :
      this.getDragStart$(
        fromEvent<MouseEvent>(document, 'mousemove', {passive: true, capture: true}),
        fromEvent<MouseEvent>(document, 'mouseup', {passive: true, capture: true}),
        event.position
      );

    this.element.classList.add('ngx-drag-holding');

    this.waitingStart = Loading.Async(start$)
      .then(start => {
        this.element.classList.remove('ngx-drag-holding');
        if (!start) return;
        this.startDrag(start, event, offset);
      });
  }

  private getDragStart$(
    move: Observable<MouseEvent | TouchEvent>,
    end: Observable<MouseEvent | TouchEvent>,
    startPos: Position
  ): Observable<false | Position> {
    let pos = startPos;

    const moved = move.pipe(
      filter(event => {
        const moveEvent = new MoveEvent(event);
        pos = moveEvent.position;

        const distanceX = Math.abs(pos.x - startPos.x);
        if (distanceX >= NgxDragDirective.MOVE_THRESHOLD) return true;

        const distanceY = Math.abs(pos.y - startPos.y);
        return distanceY >= NgxDragDirective.MOVE_THRESHOLD;
      }),
      map(() => true),
      startWith(false)
    );

    const ended = end.pipe(
      map(() => true),
      startWith(false)
    );

    const delay = this.dragDelay();
    const timerFinish = delay <= 0
      ? of(true)
      : timer(this.dragDelay()).pipe(
        map(() => true),
        startWith(false)
      );

    return combineLatest([moved, ended, timerFinish]).pipe(
      skip(1),
      first(([moved, ended]) => moved || ended),
      map(([_, ended, finished]) => !ended && finished && pos)
    )
  }

  //</editor-fold>

  private startDrag(position: Position, event: MoveEvent, offset: Position) {

    this.zone.run(() => {
      const context = new NgxDragStartContext<T>(this.element, this.dragData());
      this.dragStart.emit(context);

      if (context.data === undefined) return;

      this.context = this.service.startDrag(this.element, context.data, position, event, offset);
    });
  }
}
