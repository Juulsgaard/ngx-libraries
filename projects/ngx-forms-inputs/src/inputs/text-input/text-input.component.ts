import {ControlContainer, FormsModule} from "@angular/forms";
import {Component, Host, Optional, SkipSelf} from "@angular/core";
import {harmonicaAnimation} from "@consensus-labs/ngx-tools";
import {BaseInputComponent, FormScopeService} from "@consensus-labs/ngx-forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";

@Component({
  selector: 'form-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  animations: [harmonicaAnimation()],
  imports: [
    MatLegacyInputModule,
    NgIf,
    MatLegacyTooltipModule,
    AsyncPipe,
    FormsModule
  ],
  standalone: true
})
export class TextInputComponent extends BaseInputComponent<string|undefined, string> {

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, @Optional() formScope: FormScopeService) {
    super(controlContainer, formScope);
  }

  postprocessValue(value: string | undefined) {
    return value ? value : undefined;
  }

  preprocessValue(value: string | undefined): string {
    return value ?? "";
  }

}
