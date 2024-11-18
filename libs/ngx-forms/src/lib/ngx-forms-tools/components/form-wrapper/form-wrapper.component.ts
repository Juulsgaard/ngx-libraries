import {
  booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, input, InputSignalWithTransform, output
} from '@angular/core';
import {FormContext} from "../../services/form-context.service";
import {FormsModule} from "@angular/forms";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'ngx-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
  providers: [{provide: FormContext, useExisting: forwardRef(() => FormWrapperComponent)}],
  imports: [
    FormsModule,
    NgTemplateOutlet
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormWrapperComponent extends FormContext {

  readonly submitted = output();

  readonly fieldset: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly readonly: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  constructor() {
    super();
  }
}
