import {booleanAttribute, Directive, ElementRef, input, model, viewChild} from "@angular/core";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {inputControl} from "./input-control";
import {inputValue} from "./input-value";
import {InputComponent} from "./input-component";

@Directive()
export class TestInputComponent implements InputComponent<string> {
  value = model<string>();
  input = input<IFormInput<string>>();

  element = viewChild('input', {read: ElementRef<HTMLElement>})

  label = input<string>();
  placeholder = input<string>();
  tooltip = input<string>();
  autocomplete = input<string>();

  readonly = input(false, {transform: booleanAttribute});
  disabled = input(false, {transform: booleanAttribute});
  required = input(false, {transform: booleanAttribute});
  autoFocus = input(false, {transform: booleanAttribute});

  warning = input<string>();
  error = input<string>();

  readonly control = inputControl(this);
  readonly val = inputValue.nullable(this.control, '', true);
}
