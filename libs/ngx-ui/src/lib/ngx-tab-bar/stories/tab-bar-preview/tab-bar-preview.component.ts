import {Component, EventEmitter, Output} from '@angular/core';
import {NgxTabDirective} from "../../directives";
import {NgxTabBarComponent} from "../../components";

@Component({
  selector: 'ngx-tab-bar-preview',
  standalone: true,
  imports: [NgxTabBarComponent, NgxTabDirective, NgxTabDirective, NgxTabBarComponent],
  templateUrl: './tab-bar-preview.component.html',
  styleUrls: ['./tab-bar-preview.component.css']
})
export class TabBarPreviewComponent {
  @Output() slugChange = new EventEmitter<string|undefined>();

  onChange(slug: string|undefined) {
    console.log(slug);
    this.slugChange.emit(slug)
  }
}
