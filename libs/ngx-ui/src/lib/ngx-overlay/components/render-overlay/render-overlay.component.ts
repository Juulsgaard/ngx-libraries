import {ChangeDetectionStrategy, Component, ElementRef, inject} from '@angular/core';
import {overlayAnimation, setElementClasses, TemplateRenderDirective, TemplateRendering} from '@juulsgaard/ngx-tools'
import {OverlayContext} from "../../models/overlay-context";
import {OVERLAY_ANIMATE_IN} from "../../models/overlay-tokens";

@Component({
  templateUrl: './render-overlay.component.html',
  styleUrls: ['./render-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    overlayAnimation(),
  ],
  host: {'[@overlay]': 'animate', '[class.ngx-overlay]': 'true'},
  selector: 'ngx-overlay',
  imports: [
    TemplateRenderDirective
  ],
  standalone: true
})
export class RenderOverlayComponent {

  readonly content: TemplateRendering;
  animate = inject(OVERLAY_ANIMATE_IN);

  private canClose = false;
  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private context = inject(OverlayContext);

  constructor() {

    this.element.style.zIndex = this.context.zIndex?.toFixed(0) ?? '';

    this.content = this.context.content;

    setElementClasses(() => ({
      'closable': this.context.canClose(),
      'scrollable': this.context.scrollable()
    }));

    setElementClasses(this.context.type);
    setElementClasses(this.context.styles);
  }

  onClose() {
    if (!this.canClose) return;
    this.context.close();
  }
}
