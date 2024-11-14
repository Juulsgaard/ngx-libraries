import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation, IconDirective, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {IconButtonComponent} from "@juulsgaard/ngx-material";
import {FormInputErrorsComponent} from "../../components";


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
    MatIconModule,
    IconDirective,
    MatTooltipModule,
    MatButtonModule,
    NoClickBubbleDirective,
    IconButtonComponent,
    FormInputErrorsComponent,
    NgxInputDirective
  ],
  standalone: true
})
export class PasswordInputComponent extends BaseInputComponent<string, string|undefined> {

  readonly showPassword = signal(false);

  constructor() {
    super();
  }

  toggleShow(event: MouseEvent) {
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
