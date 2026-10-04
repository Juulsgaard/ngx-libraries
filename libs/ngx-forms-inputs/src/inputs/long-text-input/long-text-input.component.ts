import {booleanAttribute, Component, ElementRef, input, model, viewChild} from '@angular/core';
import {InputComponent, inputControl, InputControls, inputValue, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatTooltip} from "@angular/material/tooltip";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {InputDirection} from "../../helpers/types";

@Component({
  selector: 'form-long-text-input',
  templateUrl: './long-text-input.component.html',
  styleUrls: ['./long-text-input.component.scss'],
  imports: [
    IconDirective,
    MatFormField,
    MatLabel,
    MatSuffix,
    FormInputErrorsComponent,
    NgxInputDirective,
    CdkTextareaAutosize,
    MatTooltip,
    IconDirective
  ]
})
export class LongTextInputComponent implements InputComponent<string | undefined> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<string>();
  readonly input = input<IFormInput<string | undefined>>();

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

  readonly control: InputControls<string | undefined> = inputControl(this);
  readonly model = inputValue(
    this.control,
    x => x,
    x => x || undefined
  );

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('outline');
  readonly direction = input<InputDirection>();
}
