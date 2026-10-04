import {FormInputErrorsComponent} from "../../components";
import {MatFormField, MatFormFieldAppearance} from "@angular/material/form-field";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/input";
import {booleanAttribute, Component, ElementRef, input, model, viewChild} from "@angular/core";
import {selectControl, SelectControls, SingleSelectComponent} from "@juulsgaard/ngx-forms";
import {IFormSingleSelect} from "@juulsgaard/ngx-forms-core";
import {MapFunc} from "@juulsgaard/ts-tools";
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'form-mat-select',
  templateUrl: './mat-select-input.component.html',
  styleUrls: ['./mat-select-input.component.scss'],
  imports: [
    IconDirective,
    FormInputErrorsComponent,
    MatFormField,
    MatLabel,
    IconDirective,
    MatTooltip,
    MatSelect,
    MatOption,
    FormsModule
  ]
})
export class MatSelectInputComponent<TValue, TItem> implements SingleSelectComponent<TValue, TItem> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<TValue>();
  readonly input = input<IFormSingleSelect<TValue, TItem>>();
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

  readonly control: SelectControls<TValue, TValue, TItem> = selectControl(this);
  readonly model = this.control.value;

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('fill');

  onOpenStatus(opened: boolean) {
    if (opened) return;
    this.control.touch();
  }
}
