import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxSideMenuOutletDirective} from "../../directives/side-menu-outlet.directive";
import {SideMenuComponent} from "../../components/side-menu/side-menu.component";
import {SideMenuTabComponent} from "../../components/side-menu-tab/side-menu-tab.component";
import {MonoSideMenuComponent} from "../../components/mono-side-menu/mono-side-menu.component";
import {SideMenuTabDirective} from "../../directives/side-menu-tab.directive";


@Component({
  selector: 'ngx-side-menu-preview',
  standalone: true,
  imports: [
    CommonModule,
    NgxSideMenuOutletDirective,
    SideMenuComponent,
    SideMenuTabComponent,
    MonoSideMenuComponent,
    SideMenuTabDirective
  ],
  templateUrl: './side-menu-preview.component.html',
  styleUrls: ['./side-menu-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuPreviewComponent {

  @Input() slug?: string;
  @Output() slugChanged = new EventEmitter<string|undefined>;

  @Input() show = false;
  @Output() showChanged = new EventEmitter<boolean|string|undefined>;

}
