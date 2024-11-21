import {Directive, effect, EmbeddedViewRef, input, InputSignal, TemplateRef, ViewContainerRef} from '@angular/core';
import {FormLayer, FormUnit} from "@juulsgaard/ngx-forms-core";

@Directive({
  selector: '[ngxFormLayer]',
  standalone: true
})
export class FormLayerDirective<TControls extends Record<string, FormUnit>> {

  readonly layer: InputSignal<FormLayer<TControls, any>> = input.required({alias: 'ngxFormLayer'});

  readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormLayerWhen'});

  view?: EmbeddedViewRef<FormLayerDirectiveContext<TControls>>;

  constructor(
    private templateRef: TemplateRef<FormLayerDirectiveContext<TControls>>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      if (!this.show()) {
        this.view?.destroy();
        this.view = undefined;
        return;
      }

      if (!this.view) {
        const context = {ngxFormLayer: this.layer().controls()};
        this.view = this.viewContainer.createEmbeddedView(this.templateRef, context);
        return;
      }

      this.view.context.ngxFormLayer = this.layer().controls();
      this.view.markForCheck();
    });
  }

  static ngTemplateContextGuard<TControls extends Record<string, FormUnit>>(
    directive: FormLayerDirective<TControls>,
    context: unknown
  ): context is FormLayerDirectiveContext<TControls> {
    return true;
  }
}

interface FormLayerDirectiveContext<TControls extends Record<string, FormUnit>> {
  ngxFormLayer: TControls;
}
