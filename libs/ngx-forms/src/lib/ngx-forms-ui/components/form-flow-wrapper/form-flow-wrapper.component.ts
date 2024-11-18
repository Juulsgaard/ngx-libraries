import {ChangeDetectionStrategy, Component, input, InputSignal, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'ngx-form-flow',
  templateUrl: './form-flow-wrapper.component.html',
  styleUrls: ['./form-flow-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.grid-template-columns]': `'repeat(auto-fit, minmax(' + minWidth() + 'px, 1fr))'`
  },
  standalone: true
})
export class FormFlowWrapperComponent {

  readonly minWidth: InputSignal<number> = input(200);

}
