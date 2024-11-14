import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "../../../components/header/header.component";
import {UiWrapperDirective} from "../../../directives/ui-wrapper.directive";

@Component({
  selector: 'ngx-headers-preview',
  standalone: true,
  imports: [CommonModule, HeaderComponent, UiWrapperDirective],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './headers-preview.component.html',
  styleUrls: ['./headers-preview.component.scss']
})
export class HeadersPreviewComponent {

  noop() {
    console.log('noop')
  }
}
