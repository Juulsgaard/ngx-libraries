import {OverlayToken, Rendering, StaticTemplateRendering} from "@juulsgaard/ngx-tools";
import {TemplateRef, ViewContainerRef} from "@angular/core";
import {OverlayOptions} from "./overlay-options";
import {OverlayContext} from "./overlay-context";
import {Subject} from "rxjs";

export class OverlayInstance extends OverlayContext {

  readonly content: StaticTemplateRendering;

  private _close$ = new Subject<void>();
  readonly close$ = this._close$.asObservable();

  get injector() {
    return this.viewContainer.injector
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private template: TemplateRef<void>,
    private token: OverlayToken,
    options: OverlayOptions
  ) {
    super(options, token.zIndex);
    this.token.escape$.subscribe(() => this.close());
    this.content = Rendering.Static(viewContainer, template);
  }

  dispose() {
    this.token.dispose();
    this._close$.complete();

    this.content.detachChangeRef();
    // Delay until after animation ends
    setTimeout(() => this.content?.dispose(), 400);
  }

  close(): void {
    this._close$.next();
  }

}
