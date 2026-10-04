import {Signal} from "@angular/core";
import {IFormInput, IFormSelect, IFormSingleSelect} from "@juulsgaard/ngx-forms-core";
import {MapFunc} from "@juulsgaard/ts-tools";
import {InputComponent} from "./input-component";

export interface SelectComponent<T, TVal, TItem> extends InputComponent<T> {
  readonly input: Signal<IFormInput<T> | IFormSelect<T, TVal, TItem> | undefined>;
  readonly items?: Signal<TItem[] | undefined>;

  readonly hideEmpty?: Signal<boolean>;
  readonly clearable?: Signal<boolean>;

  readonly bindValue?: Signal<MapFunc<TItem, TVal> | undefined>;
  readonly bindLabel?: Signal<MapFunc<TItem, string> | undefined>;
  readonly bindOption?: Signal<MapFunc<TItem, string> | undefined>;
}

export interface SingleSelectComponent<T, TItem> extends SelectComponent<T, T, TItem> {
  readonly input: Signal<IFormSingleSelect<T, TItem> | IFormInput<T> | undefined>;
}

export interface MultiSelectComponent<T, TItem> extends SelectComponent<T[], T, TItem> {
  readonly input: Signal<IFormSingleSelect<T[], TItem> | IFormInput<T[]> | undefined>;
}
