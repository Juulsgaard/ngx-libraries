import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {BaseInputComponent} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation} from "@juulsgaard/ngx-tools";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'form-bool-input',
  templateUrl: './bool-input.component.html',
  styleUrls: ['./bool-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSlideToggle,
    FormsModule,
    IconDirective,
    NgIf,
    MatTooltip
  ],
  standalone: true
})
export class BoolInputComponent extends BaseInputComponent<boolean, boolean> {

  readonly labelPosition: InputSignal<"before" | "after"> = input<'before' | 'after'>('after');

  constructor() {
    super();
  }

  postprocessValue(value: boolean) {
    return value;
  }

  preprocessValue(value: boolean | undefined) {
    return value ?? false;
  }

}
