import {computed, DestroyRef, Directive, effect, ElementRef, inject, Signal} from '@angular/core';
import {provideUiScope, UIScopeContext} from "../models/ui-scope";
import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";
import {IScrollContext, provideScrollContext, setElementClasses} from "@juulsgaard/ngx-tools";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiWrapper],ui-wrapper',
  standalone: true,
  providers: [
    provideUiScope(),
    provideScrollContext(() => UiWrapperDirective)
  ],
  hostDirectives: [CdkScrollable],
  host: {'[class.ui-wrapper]': 'true'}
})
export class UiWrapperDirective implements IScrollContext {

  readonly scrollable: Signal<boolean>;
  cdkScrollable: CdkScrollable;

  scrollDispatcher = inject(ScrollDispatcher);
  element = inject(ElementRef<HTMLElement>).nativeElement;

  constructor() {
    this.cdkScrollable = inject(CdkScrollable);

    const context = inject(UIScopeContext, {skipSelf: true});

    const wrapper = context.registerWrapper();
    setElementClasses(computed(() => wrapper().classes));

    this.scrollable = computed(() => wrapper().scrollable);

    // Deregister on init since the directive registers itself
    effect(() => {
      this.scrollDispatcher.deregister(this.cdkScrollable);
    });

    effect(() => {
      if (this.scrollable()) this.scrollDispatcher.register(this.cdkScrollable);
      else this.scrollDispatcher.deregister(this.cdkScrollable);
    });

    inject(DestroyRef).onDestroy(() => {
      this.scrollDispatcher.deregister(this.cdkScrollable);
    });
  }
}
