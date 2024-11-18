import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {NgIf} from "@angular/common";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";


@Component({
  selector: 'form-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatLabel,
    MatSuffix,
    NgIf,
    IconDirective,
    NoClickBubbleDirective,
    IconButtonComponent,
    FormInputErrorsComponent,
    NgxInputDirective,
    MatTooltip,
    IconButtonComponent
  ],
  standalone: true
})
export class PasswordInputComponent extends BaseInputComponent<string, string|undefined> {

  readonly showPassword = signal(false);

  constructor() {
    super();
  }

  toggleShow() {
    this.showPassword.update(x => !x);
    this.inputElement()?.focus();
  }

  preprocessValue(value: string | undefined): string | undefined {
    return value;
  }

  postprocessValue(value: string | undefined): string | undefined {
    return value || undefined;
  }
}
