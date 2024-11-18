import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconDirective} from '../../../lib/icon/directives/icon.directive';
import {ButtonComponent, IconButtonComponent} from "../../../lib/buttons";

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
