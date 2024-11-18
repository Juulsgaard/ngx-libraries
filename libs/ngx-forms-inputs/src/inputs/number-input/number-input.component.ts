import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {NgIf} from "@angular/common";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";

@Component({
  selector: 'form-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatSuffix,
    NgIf,
    IconDirective,
    FormInputErrorsComponent,
    NgxInputDirective
  ],
  providers: []
})
export class NumberInputComponent extends BaseInputComponent<number, string|undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: string | undefined) {
    if (!value) return undefined;
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }

  preprocessValue(value: number | undefined): string|undefined {
    return value?.toString();
  }

}
