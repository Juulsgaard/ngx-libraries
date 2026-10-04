import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, input, InputSignal, InputSignalWithTransform
} from '@angular/core';
import {harmonicaInAnimation} from "@juulsgaard/ngx-tools";
import {InputControls} from "@juulsgaard/ngx-forms";

@Component({
  selector: 'ngx-form-input-errors',
  standalone: true,
  imports: [],
  templateUrl: './form-input-errors.component.html',
  styleUrl: './form-input-errors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [harmonicaInAnimation()],
})
export class FormInputErrorsComponent {

  readonly control: InputSignal<InputControls<any>|undefined> = input<InputControls<any>>();

  readonly canShowIn: InputSignalWithTransform<boolean, unknown> = input(true, {transform: booleanAttribute});
  readonly canShow = computed(() => this.control()?.showValidation() ?? this.canShowIn());

  readonly errorsIn: InputSignal<string[]> = input<string[]>([]);
  readonly errors = computed(() => this.control()?.errors() ?? this.errorsIn());

  readonly warningsIn: InputSignal<string[]> = input<string[]>([]);
  readonly warnings = computed(() => this.control()?.warnings() ?? this.warningsIn());

}
