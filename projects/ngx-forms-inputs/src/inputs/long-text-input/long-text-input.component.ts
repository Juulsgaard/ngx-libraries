import {Component, Host, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import { BaseInputComponent, FormScopeService } from '@consensus-labs/ngx-forms';
import {harmonicaAnimation} from "@consensus-labs/ngx-tools";
import {MatInputModule} from "@angular/material/input";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'form-long-text-input',
  templateUrl: './long-text-input.component.html',
  styleUrls: ['./long-text-input.component.scss'],
  animations: [harmonicaAnimation()],
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    NgIf,
    MatTooltipModule,
    AsyncPipe
  ],
  providers: []
})
export class LongTextInputComponent extends BaseInputComponent<string, string> {

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  postprocessValue(value: string | undefined) {
    return value;
  }

  preprocessValue(value: string | undefined): string {
    return value ?? "";
  }

}