import {ChangeDetectionStrategy, Component} from '@angular/core';
import {harmonicaAnimation} from "@juulsgaard/ngx-tools";
import {BaseSingleSelectInputComponent} from "@juulsgaard/ngx-forms";
import {NgIf} from "@angular/common";
import {FormInputErrorsComponent} from "../../components";
import {MatFormField} from "@angular/material/form-field";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/input";

@Component({
  selector: 'form-mat-select',
  templateUrl: './mat-select-input.component.html',
  styleUrls: ['./mat-select-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    IconDirective,
    FormInputErrorsComponent,
    MatFormField,
    MatLabel,
    IconDirective,
    MatTooltip,
    MatSelect,
    MatOption,
    FormsModule
  ],
  standalone: true
})
export class MatSelectInputComponent<TValue, TItem>
  extends BaseSingleSelectInputComponent<TValue, TItem, TValue | undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: TValue | undefined): TValue | undefined {
    return value;
  }

  preprocessValue(value: TValue | undefined): TValue | undefined {
    return value;
  }

  onOpenStatus(opened: boolean) {
    if (opened) return;
    this.markAsTouched();
  }
}
