import {booleanAttribute, Component, ElementRef, input, model, viewChild} from '@angular/core';
import {InputComponent, inputControl, InputControls, inputValue} from '@juulsgaard/ngx-forms';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'form-bool-input',
  templateUrl: './bool-input.component.html',
  styleUrls: ['./bool-input.component.scss'],
  imports: [
    MatSlideToggle,
    FormsModule,
    IconDirective,
    MatTooltip
  ]
})
export class BoolInputComponent implements InputComponent<boolean> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<boolean>();
  readonly input = input<IFormInput<boolean>>();

  readonly element = viewChild('input', {read: ElementRef<HTMLElement>})

  readonly label = input<string>();
  readonly tooltip = input<string>();

  readonly readonly = input(false, {transform: booleanAttribute});
  readonly disabled = input(false, {transform: booleanAttribute});

  readonly warning = input<string>();
  readonly error = input<string>();
  //</editor-fold>

  readonly control: InputControls<boolean> = inputControl(this);
  readonly model = inputValue.nullable(this.control, false);

  readonly color = input<ThemePalette>();
  readonly labelPosition = input<'before' | 'after'>('after');
}
