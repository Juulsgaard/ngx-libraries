import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation} from "@juulsgaard/ngx-tools";
import {NgIf} from "@angular/common";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatTooltip} from "@angular/material/tooltip";
import {IconDirective} from "@juulsgaard/ngx-ui";

@Component({
  selector: 'form-long-text-input',
  templateUrl: './long-text-input.component.html',
  styleUrls: ['./long-text-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    IconDirective,
    MatFormField,
    MatLabel,
    MatSuffix,
    FormInputErrorsComponent,
    NgxInputDirective,
    CdkTextareaAutosize,
    MatTooltip,
    IconDirective
  ],
  providers: []
})
export class LongTextInputComponent extends BaseInputComponent<string, string|undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: string | undefined): string | undefined {
    return value || undefined;
  }

  preprocessValue(value: string | undefined): string | undefined{
    return value;
  }

}
