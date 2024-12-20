import {ChangeDetectionStrategy, Component, ElementRef, inject, Signal} from '@angular/core';
import {SIDE_MENU_ANIMATE_IN} from "../../models/menu-tokens";
import {sideMenuAnimation, TemplateRenderDirective} from "@juulsgaard/ngx-tools";
import {NgxSideMenuTabContext} from "../../models/menu-tab-context";
import {RenderTab} from "../../models/render-tab";
import {SideMenuRenderContext} from "../../models/side-menu-render-context";
import {NgIf} from "@angular/common";
import {MatBadge} from "@angular/material/badge";
import {IconButtonComponent} from "../../../buttons";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  templateUrl: './render-side-menu.component.html',
  styleUrls: ['./render-side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sideMenuAnimation()],
  host: {'[@sideMenu]': 'animate', '[class.ngx-side-menu]': 'true'},
  imports: [
    NgIf,
    MatBadge,
    IconButtonComponent,
    MatTooltip,
    TemplateRenderDirective
  ],
  standalone: true
})
export class RenderSideMenuComponent {

  animate = inject(SIDE_MENU_ANIMATE_IN);

  readonly tab: Signal<RenderTab|undefined>;
  readonly tabs: Signal<NgxSideMenuTabContext[]>;
  readonly showButtons: Signal<boolean>;

  constructor(
    element: ElementRef<HTMLElement>,
    private context: SideMenuRenderContext
  ) {
    element.nativeElement.style.zIndex = context.zIndex?.toFixed(0) ?? '';
    this.tab = context.tab;
    this.tabs = context.tabs;
    this.showButtons = context.showButtons;
  }

  onClose() {
    this.context.close();
  }

  toggleTab(tab: NgxSideMenuTabContext) {
    this.context.toggleTab(tab);
  }


}
