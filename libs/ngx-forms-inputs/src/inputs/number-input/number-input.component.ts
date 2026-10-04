import {booleanAttribute, Component, ElementRef, input, model, viewChild} from '@angular/core';
import {InputComponent, inputControl, InputControls, inputValue, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {InputDirection} from "../../helpers/types";

@Component({
  selector: 'form-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatSuffix,
    IconDirective,
    FormInputErrorsComponent,
    NgxInputDirective,
    IconDirective,
    MatTooltip
  ],
})
export class NumberInputComponent implements InputComponent<number | undefined> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<number>();
  readonly input = input<IFormInput<number | undefined>>();

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
  //</editor-fold>

  readonly control: InputControls<number | undefined> = inputControl(this);
  readonly model = inputValue(
    this.control,
    x => x?.toString() ?? '',
    x => this.exportValue(x)
  );

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('outline');
  readonly direction = input<InputDirection>();

  private exportValue(value: string | undefined) {
    if (!value) return undefined;
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }
}
