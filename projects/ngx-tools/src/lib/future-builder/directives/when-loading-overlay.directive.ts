import {Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, Subscription, switchMap} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {FutureLoading} from "@consensus-labs/rxjs-tools";
import {FutureSwitch} from "../models/future-switch.model";

@Directive({selector: '[whenLoadingOverlay]'})
export class WhenLoadingOverlayDirective<T> implements OnDestroy {

  sub: Subscription;
  states$ = new Subject<FutureSwitch<T>>();

  @Input('whenLoadingOverlay') set state(state: FutureSwitch<T>) {
    this.states$.next(state);
  }

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    this.sub = this.states$.pipe(
      switchMap(x => x.loadingOverlay$),
      map(x => x ? {
        data: x instanceof FutureLoading ? x.value : undefined,
        loading: x instanceof FutureLoading
      } as TemplateContext<T> : undefined)
    ).subscribe(c => {
      if (c) this.viewContainer.createEmbeddedView(this.templateRef, c);
      else this.viewContainer.clear();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

interface TemplateContext<T> {
  data: T|undefined;
  loading: boolean;
}