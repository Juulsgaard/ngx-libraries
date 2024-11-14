import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent, IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";

@Component({
  selector: 'ngx-button-preview',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, ButtonComponent, IconDirective],
  templateUrl: './button-preview.component.html',
  styleUrls: ['./button-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonPreviewComponent {

  active = false;

}
