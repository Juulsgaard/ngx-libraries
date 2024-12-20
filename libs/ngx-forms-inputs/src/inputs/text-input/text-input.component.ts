import {ChangeDetectionStrategy, Component} from "@angular/core";
import {harmonicaAnimation} from "@juulsgaard/ngx-tools";
import {BaseInputComponent, NgxInputDirective} from "@juulsgaard/ngx-forms";
import {NgIf} from "@angular/common";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'form-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    MatFormField,
    MatLabel,
    MatSuffix,
    IconDirective,
    FormInputErrorsComponent,
    NgxInputDirective,
    IconDirective,
    MatTooltip
  ],
  standalone: true
})
export class TextInputComponent extends BaseInputComponent<string, string | undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: string | undefined): string | undefined {
    return value || undefined;
  }

  preprocessValue(value: string | undefined): string | undefined {
    return value;
  }

}
