import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
import {RenderSource} from "@juulsgaard/ngx-tools";

@Directive({selector: '[ngxDialogFooterTmpl]', standalone: true})
export class DialogFooterTemplateDirective implements RenderSource {
  constructor(
    public readonly template: TemplateRef<void>,
    public readonly viewContainer: ViewContainerRef
  ) {
  }
}
