import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform, ɵisSubscribable} from '@angular/core';
import {Subscribable, Unsubscribable} from "rxjs";

@Pipe({
  name: 'truthy',
  pure: false,
  standalone: true
})

export class TruthyPipe implements PipeTransform, OnDestroy {

  private asyncValue;
  private obj?: Promise<unknown> | Subscribable<unknown>;
  private subscription?: Unsubscribable;
  private startup = false;

  constructor(private ref: ChangeDetectorRef) {
    this.asyncValue = this.parseValue(false);
  }

  transform(value: Promise<unknown>): boolean
  transform(value: Subscribable<unknown>): boolean
  transform(value: unknown): boolean
  transform(value: null | undefined): boolean
  transform(value: Promise<unknown> | Subscribable<unknown> | unknown | null | undefined): boolean {

    if (value == null) {
      this.reset();
      return false;
    }

    if (ɵisSubscribable(value)) {
      if (value !== this.obj) {
        this.obj = value;
        this.subscription?.unsubscribe();
        this.startup = true;
        this.subscription = value.subscribe({next: x => this.setValue(x, value)});
        this.startup = false;
      }
      return this.asyncValue;
    }

    this.reset();

    if (value instanceof Promise) {
      if (value !== this.obj) {
        this.obj = value;
        this.startup = true;
        value.then(
          x => this.setValue(x, value),
          () => this.setValue(false, value)
        );
        this.startup = false;
      }
      return this.asyncValue;
    }

    return this.parseValue(value);
  }

  private reset() {
    this.subscription?.unsubscribe();
  }

  private setValue(value: unknown, obj: Promise<unknown> | Subscribable<unknown>) {
    if (obj !== this.obj) return;

    const val = this.parseValue(value);
    if (val === this.asyncValue) return;

    this.asyncValue = this.parseValue(value);
    if (this.startup) return;
    this.ref.detectChanges();
  }

  ngOnDestroy() {
    this.reset();
  }

  protected parseValue(x: unknown): boolean {
    return !!x;
  }
}
