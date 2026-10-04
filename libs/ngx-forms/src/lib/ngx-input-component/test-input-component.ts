import {booleanAttribute, Directive, ElementRef, input, model, viewChild} from "@angular/core";
import {IFormInput, IFormMultiSelect} from "@juulsgaard/ngx-forms-core";
import {inputControl} from "./input-controls";
import {inputValue} from "./input-value";
import {InputComponent} from "./input-component";
import {MultiSelectComponent} from "./select-component";
import {selectControl} from "./select-controls";
import {MapFunc} from "@juulsgaard/ts-tools";

@Directive()
export class TestInputComponent implements InputComponent<string> {

  readonly value = model<string>();
  readonly input = input<IFormInput<string>>();

  readonly element = viewChild('input', {read: ElementRef<HTMLElement>})

  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly tooltip = input<string>();
  readonly autocomplete = input<string>();

  readonly readonly = input(false, {transform: booleanAttribute});
  readonly disabled = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});
  readonly autoFocus = input(false, {transform: booleanAttribute});

  readonly warning = input<string>();
  readonly error = input<string>();

  readonly control = inputControl(this);
  readonly model = inputValue.nullable(this.control, '', true);
}

@Directive()
export class TestSelectComponent<TItem> implements MultiSelectComponent<string, TItem> {

  readonly value = model<string[]>();
  readonly input = input<IFormMultiSelect<string, TItem>>();
  readonly items = input<TItem[]>();

  readonly element = viewChild('input', {read: ElementRef<HTMLElement>})

  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly tooltip = input<string>();

  readonly readonly = input(false, {transform: booleanAttribute});
  readonly disabled = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});

  readonly hideEmpty = input(false, {transform: booleanAttribute});
  readonly clearable = input(false, {transform: booleanAttribute});

  readonly bindValue = input<MapFunc<TItem, string>>();
  readonly bindLabel = input<MapFunc<TItem, string>>();
  readonly bindOption = input<MapFunc<TItem, string>>();

  readonly warning = input<string>();
  readonly error = input<string>();

  readonly control = selectControl(this);
  readonly model = inputValue.nullable(this.control, []);
}
