import {
  booleanAttribute, computed, Directive, effect, EventEmitter, inject, input, model, OnDestroy, Output, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {Observable, of, Subscribable, switchMap} from "rxjs";
import {OverlayManagerService} from "../services/overlay-manager.service";

import {OverlayInstance} from "../models/overlay-instance";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {NgxOverlayDefaults} from "../models/overlay-defaults";
import {arrToSet, setToArr} from "@juulsgaard/ts-tools";

@Directive({selector: '[ngxOverlay]'})
export class OverlayDirective implements OnDestroy {

  private defaults = inject(NgxOverlayDefaults);
  private templateRef = inject(TemplateRef<{}>);
  private viewContainer = inject(ViewContainerRef);
  private manager = inject(OverlayManagerService);

  static ngTemplateGuard_show(
    dir: OverlayDirective,
    value: boolean,
  ): value is true {
    return true;
  }

  showIn = input.required({
    alias: 'ngxOverlay',
    transform: (show: boolean | '' | Subscribable<boolean> | undefined | null) => {
      if (show === true || show === '') return of(true);
      if (show == null || show === false) return of(false);
      return new Observable<boolean>(subscriber => show.subscribe(subscriber));
    }
  });

  show = model(true);

  @Output() closed = new EventEmitter<void>();
  //TODO: Replace with `show.observed` when possible
  allowClose = input(false, {transform: booleanAttribute});
  canClose = computed(() => this.closed.observed || this.allowClose())

  private closeOverlay() {
    this.closed.emit();
    if (this.allowClose()) this.show.set(false);
  }

  type = input<string>();
  styles = input([] as string[], {
    transform: styles => Array.isArray(styles) ? styles : styles ? [styles] : []
  });
  scrollable = input(false, {
    transform: (scrollable: boolean | '' | undefined | null) => {
      if (scrollable === '') return true;
      if (scrollable == null) return undefined;
      return scrollable;
    }
  });

  private instance?: OverlayInstance;

  constructor() {
    const show$ = toObservable(this.showIn).pipe(switchMap(x => x));
    const _show = toSignal(show$, {initialValue: false});
    const show = computed(() => _show() && this.show());
    effect(() => this.toggleOverlay(show()));
  }

  ngOnDestroy() {
    if (!this.instance) return;
    this.manager.closeOverlay(this.instance);
  }

  private toggleOverlay(show: boolean) {

    if (show) {
      if (this.instance) return;

      this.instance = this.manager.createOverlay(
        this.viewContainer,
        this.templateRef,
        {
          type: computed(() => this.type() ?? this.defaults.type),
          styles: computed(() => setToArr(arrToSet([...this.styles(), ...this.defaults.styles]))),
          scrollable: computed(() => this.scrollable() ?? this.defaults.scrollable),
          canClose: this.canClose,
        }
      );

      this.instance.close$.subscribe(() => this.closeOverlay());
      return;
    }

    if (!this.instance) return;
    this.manager.closeOverlay(this.instance);
    this.instance = undefined;
  }
}
