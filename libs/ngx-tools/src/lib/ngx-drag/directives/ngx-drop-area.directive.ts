import {
  booleanAttribute, Directive, effect, ElementRef, EventEmitter, HostListener, inject, input, InputSignal,
  InputSignalWithTransform, Output
} from '@angular/core';
import {Subscription, timer} from "rxjs";
import {NgxDropContext} from "../models/ngx-drop-context";
import {NgxDragService} from "../services/ngx-drag.service";
import {NgxDragEvent} from "../models/ngx-drag-event";

@Directive({
  selector: '[ngxDropArea]',
  host: {'[class.ngx-drop-area]': 'true'},
  standalone: false
})
export class NgxDropAreaDirective<T> {

  static readonly HOVER_CLASS = 'ngx-drop-hover';

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private service = inject(NgxDragService);

  @Output() ngxDrop = new EventEmitter<NgxDragEvent<T>>;
  @Output() ngxDropHover = new EventEmitter<NgxDropContext<T>>;

  readonly dropEffect: InputSignal<"move" | "link" | "copy" | undefined> = input<'move'|'link'|'copy'>();
  readonly dropPredicate: InputSignal<((data: NgxDragEvent<T>) => boolean) | undefined> = input<((data: NgxDragEvent<T>) => boolean)>();
  readonly disableDrop: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  get dropEffectStr() {return this.dropEffect() ?? this.service.effect ?? 'move'}

  removeHoverState?: Subscription;

  constructor() {
    effect(() => {
      this.element.classList.toggle('ngx-drop-disabled', this.disableDrop());
    });
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    const data = this.service.drag as T|undefined;

    if (data === undefined) return;
    event.preventDefault();

    if (!this.canDrop(event, data)) return;

    this.removeHoverState?.unsubscribe();
    this.element.classList.remove(NgxDropAreaDirective.HOVER_CLASS);

    const dropEvent = event as NgxDragEvent<T>;
    dropEvent.data = data;

    this.ngxDrop.emit(dropEvent);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    if (!event.dataTransfer) return;

    const data = this.service.drag as T|undefined;
    if (data === undefined) return;

    event.preventDefault();
    const canDrop = this.canDrop(event, data);
    event.dataTransfer.dropEffect = canDrop ? this.getDropEffect(event.dataTransfer) : 'none';

    if (canDrop) {
      this.removeHoverState?.unsubscribe();
      this.element.classList.add(NgxDropAreaDirective.HOVER_CLASS);
    }
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: Event) {
    event.preventDefault();
    if (this.removeHoverState && !this.removeHoverState.closed) return;
    this.removeHoverState = timer(100)
      .subscribe(() => this.element.classList.remove(NgxDropAreaDirective.HOVER_CLASS));
  }

  private canDrop(event: DragEvent, data: T) {
    if (this.disableDrop()) return false;
    const predicate = this.dropPredicate();
    if (!predicate && !this.ngxDrop.observed) return true;

    const dragEvent = event as NgxDragEvent<T>;
    dragEvent.data = data;

    const context = new NgxDropContext<T>(data, predicate?.(dragEvent) ?? true);
    this.ngxDropHover.emit(context);

    return context.allowed;
  }

  private getDropEffect(dataTransfer: DataTransfer) {
    const effect = this.dropEffectStr;
    if (effect === 'link' && dataTransfer.effectAllowed === 'copyMove') return 'move';
    return effect;
  }
}

