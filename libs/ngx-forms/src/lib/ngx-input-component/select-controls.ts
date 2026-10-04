import {assertInInjectionContext, computed, Injector, runInInjectionContext, Signal} from "@angular/core";
import {SelectComponent} from "./select-component";
import {IFormInput, IFormSelect, isFormSelect} from "@juulsgaard/ngx-forms-core";
import {inputControl, InputControls, InputControlsImpl} from "./input-controls";

export interface SelectOption<T, TVal> {
  item: T;
  value: TVal;
  label: string;
  option: string
}

export interface SelectControls<T, TVal, TItem> extends InputControls<T>{
  readonly items: Signal<TItem[]>;
  readonly options: Signal<SelectOption<TItem, TVal>[]>;

  readonly empty: Signal<boolean>;
  readonly hideWhenEmpty: Signal<boolean>;
  readonly hidden: Signal<boolean>;

  readonly clearable: Signal<boolean>;
}

export class SelectControlsImpl<T, TVal, TItem> extends InputControlsImpl<T> {

  declare protected readonly component: SelectComponent<T, TVal, TItem>;
  declare protected readonly input: Signal<IFormSelect<T, TVal, TItem> | IFormInput<T> | undefined>;

  private selectInput = computed(() => {
    const input = this.input();
    if (isFormSelect(input)) return input as IFormSelect<T, TVal, TItem>;
    return undefined;
  });

  readonly items: Signal<TItem[]> = computed(
    () => this.selectInput()?.items() ?? this.component.items?.() ?? []
  );
  readonly options: Signal<SelectOption<TItem, TVal>[]> = computed(
    () => this.mapItems(this.items())
  );

  readonly empty: Signal<boolean> = computed(() => this.items().length <= 0);
  readonly hideWhenEmpty: Signal<boolean> = computed(() => this.component.hideEmpty?.() ?? false);
  readonly hidden: Signal<boolean> = computed(
    () =>
      (this.hideWhenDisabled() && this.disabled()) ||
      (this.hideWhenEmpty() && this.empty())
  );

  readonly clearable = computed(
    () => this.selectInput()?.clearable ?? this.component.clearable?.() ?? false
  );

  constructor(component: SelectComponent<T, TVal, TItem>) {
    super(component);
  }

  private mapItems(items: TItem[]): SelectOption<TItem, TVal>[] {
    const mapValue = this.selectInput()?.bindValue ?? this.component.bindValue?.();
    const mapLabel = this.selectInput()?.bindLabel ?? this.component.bindLabel?.();
    const mapOption = this.selectInput()?.bindOption ?? this.component.bindOption?.();

    return items.map(x => {
      const label = mapLabel?.(x) ?? String(x);
      return {
        item: x,
        value: mapValue?.(x) ?? x as unknown as TVal,
        label: label,
        option: mapOption?.(x) ?? label,
      } satisfies SelectOption<TItem, TVal>
    });
  }
}

interface SelectControlOptions {
  injector?: Injector
}

export function selectControl<T, TVal, TItem>(
  component: SelectComponent<T, TVal, TItem>,
  options?: SelectControlOptions
): SelectControls<T, TVal, TItem> {

  const injector = options?.injector;
  if (!injector) assertInInjectionContext(inputControl);

  return injector
    ? runInInjectionContext(injector, () => new SelectControlsImpl(component))
    : new SelectControlsImpl(component);
}
