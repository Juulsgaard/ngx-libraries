import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {BaseInputComponent} from '@juulsgaard/ngx-forms';
import {harmonicaAnimation} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'form-bool-input',
  templateUrl: './bool-input.component.html',
  styleUrls: ['./bool-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
