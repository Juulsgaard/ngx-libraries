import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {setElementClasses} from "@juulsgaard/ngx-tools";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'ngx-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinner
  ]
})
export class LoadingOverlayComponent {

  readonly type: InputSignal<"content" | "fixed" | "absolute"> = input<'content'|'fixed'|'absolute'>('fixed');

  constructor() {
    setElementClasses(this.type);
  }

}
