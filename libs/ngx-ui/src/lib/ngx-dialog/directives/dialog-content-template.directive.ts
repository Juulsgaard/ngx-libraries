import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
import {RenderSource} from "@juulsgaard/ngx-tools";

@Directive({selector: '[ngxDialogContentTmpl]', standalone: true})
export class DialogContentTemplateDirective implements RenderSource {

  constructor(
    public readonly template: TemplateRef<void>,
    public readonly viewContainer: ViewContainerRef
  ) {
  }

}
