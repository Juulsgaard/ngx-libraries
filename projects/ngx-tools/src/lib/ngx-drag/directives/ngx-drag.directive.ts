import {
  booleanAttribute, Directive, effect, ElementRef, inject, input, InputSignal, InputSignalWithTransform, NgZone, output
} from '@angular/core';
import {NgxDragContext, NgxDragStartContext} from "../models/ngx-drag-context";
import {NgxDragService} from "../services/ngx-drag.service";
import {combineLatest, fromEvent, Observable, skip, startWith, timer} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter, first, map} from "rxjs/operators";
import {Loading} from "@juulsgaard/rxjs-tools";

@Directive({
  selector: '[ngxDrag]',
  host: {'[class.ngx-drag]': 'true'}
})
export class NgxDragDirective<T> {

  static readonly MOVE_THRESHOLD = 5;

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
    effect(() => this.element.classList('ngx-drag-disabled', this.disableDrag()));

    this.zone.runOutsideAngular(() => {
      fromEvent<MouseEvent>(this.element, 'mousedown').pipe(takeUntilDestroyed()).subscribe(e => this.start(e));
      fromEvent<TouchEvent>(this.element, 'touchdown').pipe(takeUntilDestroyed()).subscribe(e => this.start(e));
    });
  }

  private start(event: MouseEvent | TouchEvent) {
    if (this.dragging || this.delayedStart.loading) return;


    if (this.dragDelay() <= 0) {
      this.startDrag();
      return;
    }

    this.startDragDelay(event);
  }

  private delayedStart = Loading.Empty();

  private startDragDelay(event: MouseEvent | TouchEvent) {
    if (this.disableDrag()) return;

    const touch = event instanceof TouchEvent;
    const position = this.getPosition(event);

    const start$ = touch ?
      this.getDelayedStart$(
        fromEvent<MouseEvent>(window, 'touchmove', {passive: true}),
        fromEvent<MouseEvent>(window, 'touchend', {passive: true}),
        position
      ) :
      this.getDelayedStart$(
        fromEvent<MouseEvent>(window, 'mousemove', {passive: true}),
        fromEvent<MouseEvent>(window, 'mouseup', {passive: true}),
        position
      );

    this.delayedStart = Loading.Async(start$)
      .then(start => {
        if (!start) return;
        this.startDrag();
      });
  }

  private startDrag() {
    if (this.disableDrag()) return;

    this.zone.run(() => {
      const context = new NgxDragStartContext<T>(this.element, this.dragData());
      this.dragStart.emit(context);

      if (context.data === undefined) return;

      this.context = this.service.startDrag(this.element, context.data);
    });
  }

  private getPosition(event: MouseEvent | TouchEvent): Position {
    const pos = event instanceof TouchEvent ? event.touches[0] ?? event.changedTouches[0]! : event;
    return {x: pos?.clientX + window.scrollX, y: pos.clientY + window.scrollY};
  }

  private getDelayedStart$(
    move: Observable<MouseEvent | TouchEvent>,
    end: Observable<MouseEvent | TouchEvent>,
    startPos: Position
  ): Observable<boolean> {
    const moved = move.pipe(
      filter(event => {
        const pos = this.getPosition(event);
        const distanceX = Math.abs(pos.x - startPos.x);
        const distanceY = Math.abs(pos.y - startPos.y);
        return distanceX + distanceY >= NgxDragDirective.MOVE_THRESHOLD;
      }),
      map(() => true),
      startWith(false)
    );

    const ended = end.pipe(
      map(() => true),
      startWith(false)
    );

    const timerFinish = timer(this.dragDelay()).pipe(
      map(() => true),
      startWith(false)
    );

    return combineLatest([moved, ended, timerFinish]).pipe(
      skip(1),
      first(),
      map(([_, __, finished]) => finished)
    )
  }
}

interface Position {
  x: number;
  y: number;
}
