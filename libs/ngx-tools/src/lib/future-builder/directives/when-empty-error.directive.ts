import {ChangeDetectorRef, Directive, effect, input, InputSignal, TemplateRef, ViewContainerRef} from '@angular/core';
import {switchMap} from "rxjs";
import {FutureSwitch} from "../models/future-switch.model";
import {BaseFutureRender} from "../models/base-future.render";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({selector: '[whenEmptyError]'})
export class WhenEmptyErrorDirective<T> extends BaseFutureRender<TemplateContext> {

  state: InputSignal<FutureSwitch<T>> = input.required<FutureSwitch<T>>({alias: 'whenEmptyError'});

  constructor(
    templateRef: TemplateRef<TemplateContext>,
    viewContainer: ViewContainerRef,
    changes: ChangeDetectorRef
  ) {
    super(templateRef, viewContainer, changes);

    const state$ = toObservable(this.state).pipe(switchMap(x => x.emptyError$));
    const state = toSignal(state$);

    effect(() => {
      const x = state();
      if (!x) return this.updateView(undefined);

      this.updateView({whenEmptyError: x.error});
    });
  }

  static ngTemplateContextGuard<T>(
    directive: WhenEmptyErrorDirective<T>,
    context: unknown
  ): context is TemplateContext {
    return true;
  }
}

interface TemplateContext {
  whenEmptyError: Error;
}
