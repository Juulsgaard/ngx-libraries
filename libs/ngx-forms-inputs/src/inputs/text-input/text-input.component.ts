import {booleanAttribute, Component, ElementRef, input, model, viewChild} from "@angular/core";
import {InputComponent, inputControl, InputControls, inputValue, NgxInputDirective} from "@juulsgaard/ngx-forms";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {InputDirection} from "../../helpers/types";
import {IFormInput} from "@juulsgaard/ngx-forms-core";

@Component({
  selector: 'form-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatSuffix,
    IconDirective,
    FormInputErrorsComponent,
    NgxInputDirective,
    IconDirective,
    MatTooltip
  ]
})
export class TextInputComponent implements InputComponent<string | undefined> {

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

}
