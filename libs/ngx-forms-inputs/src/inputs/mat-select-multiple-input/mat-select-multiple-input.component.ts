import {booleanAttribute, Component, ElementRef, input, model, viewChild} from '@angular/core';
import {inputValue, MultiSelectComponent, selectControl, SelectControls} from "@juulsgaard/ngx-forms";
import {FormInputErrorsComponent} from "../../components";
import {MatFormField, MatFormFieldAppearance} from "@angular/material/form-field";
import {ButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/input";
import {ThemePalette} from "@angular/material/core";
import {IFormMultiSelect} from "@juulsgaard/ngx-forms-core";
import {MapFunc} from "@juulsgaard/ts-tools";

@Component({
  selector: 'form-mat-select-multiple',
  templateUrl: './mat-select-multiple-input.component.html',
  styleUrls: ['./mat-select-multiple-input.component.scss'],
  imports: [
    IconDirective,
    FormInputErrorsComponent,
    ButtonComponent,
    MatFormField,
    MatLabel,
    IconDirective,
    MatSelect,
    ButtonComponent,
    MatOption,
    MatTooltip,
    FormsModule
  ]
})
export class MatSelectMultipleInputComponent<TValue, TItem> implements MultiSelectComponent<TValue, TItem> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<TValue[]>();
  readonly input = input<IFormMultiSelect<TValue, TItem>>();
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

  readonly bindValue = input<MapFunc<TItem, TValue>>();
  readonly bindLabel = input<MapFunc<TItem, string>>();
  readonly bindOption = input<MapFunc<TItem, string>>();

  readonly warning = input<string>();
  readonly error = input<string>();
  //</editor-fold>

  readonly control: SelectControls<TValue[], TValue, TItem> = selectControl(this);
  readonly model = inputValue.nullable(this.control, []);

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('fill');

  onOpenStatus(opened: boolean) {
    if (opened) return;
    this.control.touch();
  }

  clear() {
    this.model.set([]);
  }
}
