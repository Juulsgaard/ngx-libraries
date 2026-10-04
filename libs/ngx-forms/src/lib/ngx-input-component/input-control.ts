import {
  afterNextRender, assertInInjectionContext, computed, inject, Injector, linkedSignal, runInInjectionContext, signal,
  Signal, untracked, viewChildren, WritableSignal
} from "@angular/core";
import {ErrorStateMatcher} from "@angular/material/core";
import {
  alwaysErrorStateMatcher, FormContext, InputComponent, neverErrorStateMatcher, touchedErrorStateMatcher
} from "@juulsgaard/ngx-forms";
import {scrollToElement} from "@juulsgaard/ts-tools";
import {ScrollContext} from "@juulsgaard/ngx-tools";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormInputEvent, InputEvents} from "@juulsgaard/ngx-forms-core";
import {NgModel} from "@angular/forms";

export class InputControls<T> {

  private scrollContainer = inject(ScrollContext, {optional: true});
  private input = computed(() => this.component.input());

  readonly value: WritableSignal<T | undefined>;

  readonly label: Signal<string | undefined> = computed(
    () => this.component.label?.() ?? this.input()?.label
  );

  readonly placeholder: Signal<string | undefined> = computed(
    () => this.component.placeholder?.() ?? this.label()
  );

  readonly tooltip: Signal<string | undefined> = computed(
    () => this.component.tooltip?.() ?? this.input()?.tooltip
  );

  readonly autocomplete: Signal<string | undefined> = computed(
    () => this.component.autocomplete?.() ?? this.input()?.autocomplete
  );


  readonly required: Signal<boolean> = computed(
    () => this.component.required?.() || this.input()?.required || false
  );

  readonly disabled: Signal<boolean> = computed(
    () => this.component.disabled?.() || this.input()?.disabled() || false
  );

  readonly autoFocus: Signal<boolean> = computed(
    () => this.component.autoFocus?.() || this.input()?.autoFocus || false
  );

  private formScope = inject(FormContext, {optional: true});
  readonly readonly: Signal<boolean> = computed(
    () => this.component.readonly?.() || this.formScope?.readonly() || this.input()?.readonly || false
  );

  //<editor-fold desc="Validation">
  readonly errors: Signal<string[]> = computed(() => [
    ...this.input()?.errors() ?? [],
    ...this.component.error?.() ? [this.component.error()!] : []
  ]);
  readonly hasError: Signal<boolean> = computed(() => this.errors().length > 0)

  readonly warnings: Signal<string[]> = computed(() => [
    ...this.input()?.warnings() ?? [],
    ...this.component.warning?.() ? [this.component.warning()!] : []
  ]);
  readonly hasWarning: Signal<boolean> = computed(() => this.warnings().length > 0);

  readonly showValidation: Signal<boolean> = computed(() => this.touched() || this.changed())
  readonly showError: Signal<boolean> = computed(() => this.showValidation() && this.hasError());
  readonly errorMatcher: Signal<ErrorStateMatcher> = computed(() => {
    if (!this.hasError()) return neverErrorStateMatcher;
    if (this.touched() || this.changed()) return alwaysErrorStateMatcher;
    return touchedErrorStateMatcher;
  });
  //</editor-fold>

  readonly changed = computed(() => this.input()?.changed() ?? false);

  private readonly _touched = signal(false);
  readonly touched: Signal<boolean> = computed(() => this.input()?.touched() ?? this._touched());

  constructor(private readonly component: InputComponent<T>) {

    this.value = linkedSignal(() => {
      const input = component.input();
      if (input) return input.state();
      return component.value();
    });

    this.value.set = x => {
      component.input()?.setValue(x);
      component.value.set(x);
    }

    this.input()?.actions$
      ?.pipe(takeUntilDestroyed())
      .subscribe(event => this.handleAction(event));

    this.input()?.reset$
      ?.pipe(takeUntilDestroyed())
      .subscribe(() => this.handleReset());

    afterNextRender(() => {
      if (this.autoFocus()) this.focus()
    });
  }

  //<editor-fold desc="Touch">
  touch(): void {
    this._touched.set(true);
    this.input()?.markAsTouched();
  }

  untouch(): void {
    this._touched.set(false);
    this.input()?.markAsUntouched();
  }

  //</editor-fold>

  //<editor-fold desc="Reset">
  /** A list of all NgModels in the input */
  private ngModels = viewChildren(NgModel);

  private handleReset() {
    untracked(this.ngModels).forEach(x => {
      x.control.markAsPristine();
      x.control.markAsUntouched();
    });
  }
  //</editor-fold>

  //<editor-fold desc="Actions">

  private getElement() {
    return untracked(() => this.component.element?.())?.nativeElement;
  }

  /** Handle events dispatched from the FormNode */
  protected handleAction(event: FormInputEvent) {
    switch (event) {
      case InputEvents.Focus:
        this.focus({preventScroll: true});
        break;
      case InputEvents.Select:
        this.select();
        break;
      case InputEvents.ScrollTo:
        this.scrollTo();
        break;
    }
  }

  /** Focus the input */
  focus(options?: FocusOptions) {

    if (this.component.focus) {
      this.component.focus();
      return;
    }

    this.getElement()?.focus(options);
  }

  /** Select the contents of the input */
  select() {

    if (this.component.select) {
      this.component.select();
      return;
    }

    const element = this.getElement();
    const canSelect = !!element && 'select' in element;
    if (!canSelect) return;
    element.select();
  }

  scrollTo() {
    if (this.component.scrollTo) {
      this.component.scrollTo();
      return;
    }

    const element = this.getElement();
    if (!element) return;

    const container = untracked(() => this.scrollContainer?.scrollContainer());
    scrollToElement(element, {container: container, offset: 40});
  }

  //</editor-fold>
}

interface InputControlOptions {
  injector?: Injector
}

export function inputControl<T>(component: InputComponent<T>, options?: InputControlOptions): InputControls<T> {

  const injector = options?.injector;
  if (!injector) assertInInjectionContext(inputControl);

  return injector
    ? runInInjectionContext(injector, () => new InputControls<T>(component))
    : new InputControls<T>(component);
}
