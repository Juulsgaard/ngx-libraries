import {
  Directive, EmbeddedViewRef, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef
} from '@angular/core';
import {mergeWith, Observable, Subscribable} from "rxjs";
import {
  AsyncObjectMapper, AsyncOrSyncObject, AsyncVal, AsyncValueMapper, isSubscribable, UnwrappedAsyncOrSyncObject,
  UnwrappedAsyncVal
} from "@juulsgaard/rxjs-tools";
import {Dispose} from "../decorators";
import {isObject} from "@juulsgaard/ts-tools";

@Directive({selector: '[ngxAsyncAwait]', standalone: true})
export class NgxAsyncAwaitDirective<T extends AsyncVal<unknown>|AsyncOrSyncObject<Record<string, unknown>>> implements OnChanges {

  @Input({required: true, alias: 'ngxAsyncAwait'}) values!: T;
  @Input({alias: 'ngxAsyncAwaitElse'}) elseTemplate?: TemplateRef<void>;

  private view?: EmbeddedViewRef<TemplateContext<T>>;
  private elseView?: EmbeddedViewRef<void>;

  constructor(
    private templateRef: TemplateRef<TemplateContext<T>>,
    private viewContainer: ViewContainerRef
  ) {
    this.valueMapper.value$.pipe(mergeWith(this.objectMapper.values$)).subscribe(x => {
      this.destroyElse();
      this.renderMain(x as MappedValues<T>);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('values' in changes) {
      if (this.values instanceof Promise) this.updateSingle(this.values);
      else if (this.values instanceof Observable || isSubscribable(this.values)) this.updateSingle(this.values);
      else if (isObject(this.values)) this.updateObject(this.values);
    }

    if ('elseTemplate' in changes) {
      this.destroyElse();

      if (this.elseTemplate && !this.view) {
        this.renderElse();
      }
    }
  }

  //<editor-fold desc="Render Controls">
  destroyMain() {
    if (!this.view) return;
    this.view.destroy();
    this.view = undefined;
  }

  renderMain(context: MappedValues<T>) {

    if (!this.view) {
      this.view = this.viewContainer.createEmbeddedView(this.templateRef, {ngxAsyncAwait: context});
      this.view.markForCheck();
    } else {
      this.view.context = {ngxAsyncAwait: context};
      this.view.markForCheck();
    }
  }

  destroyElse() {
    if (!this.elseView) return;
    this.elseView.destroy();
    this.elseView = undefined;
  }

  renderElse() {
    if (this.elseView) return;
    if (!this.elseTemplate) return;
    this.elseView = this.viewContainer.createEmbeddedView(this.elseTemplate);
  }
  //</editor-fold>

  private oldVal?: AsyncVal<unknown>;
  @Dispose private valueMapper = new AsyncValueMapper<unknown>();

  updateSingle(value: AsyncVal<unknown>) {
    this.objectMapper.reset();

    if (this.oldVal === value) return;
    this.oldVal = value;

    if (!this.view) {
      this.valueMapper.update(value);
      return;
    }

    let emitted = false;
    const sub = this.valueMapper.value$.subscribe(() => emitted = true);
    this.valueMapper.update(value);
    sub.unsubscribe();

    if (!emitted) {
      this.destroyMain();
      this.renderElse();
    }
  }

  @Dispose private objectMapper = new AsyncObjectMapper<Record<string, unknown>>();
  updateObject(values: Record<string, unknown>) {
    this.valueMapper.reset();

    if (!this.view) {
      this.objectMapper.update(values);
      return;
    }

    let emitted = false;
    const sub = this.objectMapper.values$.subscribe(() => emitted = true);
    this.objectMapper.update(values);
    sub.unsubscribe();

    if (!emitted) {
      this.destroyMain();
      this.renderElse();
    }
  }

  static ngTemplateContextGuard<T extends AsyncVal<unknown>|AsyncOrSyncObject<Record<string, unknown>>>(
    directive: NgxAsyncAwaitDirective<T>,
    context: unknown
  ): context is TemplateContext<T> {
    return true;
  }

}

interface TemplateContext<T> {
  ngxAsyncAwait: MappedValues<T>;
}

type MappedValues<T> = T extends Subscribable<unknown>|Observable<unknown>|Promise<unknown> ? UnwrappedAsyncVal<T> :
  T extends Record<string, unknown> ? UnwrappedAsyncOrSyncObject<T> :
    never;
