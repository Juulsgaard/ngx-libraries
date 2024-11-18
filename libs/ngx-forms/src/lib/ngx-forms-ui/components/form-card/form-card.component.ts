import {ChangeDetectionStrategy, Component, input, InputSignal, ViewEncapsulation} from '@angular/core';
import {IconDirective} from "@juulsgaard/ngx-ui";
import {NgIf} from "@angular/common";


@Component({
  selector: 'ngx-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconDirective,
    NgIf
  ],
  standalone: true
})
export class FormCardComponent {

  readonly icon: InputSignal<string | undefined> = input<string>();

}
