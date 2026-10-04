import {booleanAttribute, Component, ElementRef, input, model, signal, viewChild} from '@angular/core';
import {InputComponent, inputControl, InputControls, inputValue, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {InputDirection} from "../../helpers/types";


@Component({
  selector: 'form-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatSuffix,
    IconDirective,
    NoClickBubbleDirective,
    IconButtonComponent,
    FormInputErrorsComponent,
    NgxInputDirective,
    MatTooltip,
    IconButtonComponent
  ]
})
export class PasswordInputComponent implements InputComponent<string | undefined> {

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
  readonly model = inputValue.nullable(this.control, '', true);

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('outline');
  readonly direction = input<InputDirection>();

  readonly showPassword = signal(false);

  toggleShow() {
    this.showPassword.update(x => !x);
    this.control.focus();
  }
}
