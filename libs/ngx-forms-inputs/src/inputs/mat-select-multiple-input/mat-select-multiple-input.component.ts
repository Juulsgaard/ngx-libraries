import {ChangeDetectionStrategy, Component} from '@angular/core';
import {harmonicaAnimation} from "@juulsgaard/ngx-tools";
import {BaseMultiSelectInputComponent} from "@juulsgaard/ngx-forms";
import {NgIf} from "@angular/common";
import {FormInputErrorsComponent} from "../../components";
import {MatFormField} from "@angular/material/form-field";
import {ButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/input";

@Component({
  selector: 'form-mat-select-multiple',
  templateUrl: './mat-select-multiple-input.component.html',
  styleUrls: ['./mat-select-multiple-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
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
  ],
  standalone: true
})
export class MatSelectMultipleInputComponent<TValue, TItem>
  extends BaseMultiSelectInputComponent<TValue, TItem, TValue[]> {

  constructor() {
    super();
  }

  postprocessValue(value: TValue[]): TValue[]|undefined {
    return value.length ?  value : undefined;
  }

  preprocessValue(value: TValue[]|undefined): TValue[] {
    return value ?? [];
  }

  onOpenStatus(opened: boolean) {
    if (opened) return;
    this.markAsTouched();
  }

  clear() {
    this.value = [];
  }
}
