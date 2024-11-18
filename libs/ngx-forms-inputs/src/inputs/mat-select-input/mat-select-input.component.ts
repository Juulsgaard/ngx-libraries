import {ChangeDetectionStrategy, Component} from '@angular/core';
import {harmonicaAnimation, IconDirective} from "@juulsgaard/ngx-tools";
import {BaseSingleSelectInputComponent} from "@juulsgaard/ngx-forms";
import {NgIf} from "@angular/common";
import {FormInputErrorsComponent} from "../../components";

@Component({
  selector: 'form-mat-select',
  templateUrl: './mat-select-input.component.html',
  styleUrls: ['./mat-select-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    IconDirective,
    FormInputErrorsComponent
  ],
  standalone: true
})
export class MatSelectInputComponent<TValue, TItem>
  extends BaseSingleSelectInputComponent<TValue, TItem, TValue | undefined> {

  constructor() {
    super();
  }

  postprocessValue(value: TValue | undefined): TValue | undefined {
    return value;
  }

  preprocessValue(value: TValue | undefined): TValue | undefined {
    return value;
  }

  onOpenStatus(opened: boolean) {
    if (opened) return;
    this.markAsTouched();
  }
}
