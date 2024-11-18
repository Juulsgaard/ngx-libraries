import {Component, ViewEncapsulation} from '@angular/core';
import {HeaderComponent} from "../../../components/header/header.component";
import {UiWrapperDirective} from "../../../directives/ui-wrapper.directive";
import {NgxTabBarComponent, NgxTabDirective} from "../../../lib/ngx-tab-bar";

@Component({
  selector: 'ngx-headers-preview',
  standalone: true,
  imports: [HeaderComponent, UiWrapperDirective, NgxTabBarComponent, NgxTabDirective],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './headers-preview.component.html',
  styleUrls: ['./headers-preview.component.scss']
})
export class HeadersPreviewComponent {

  noop() {
    console.log('noop')
  }
}
