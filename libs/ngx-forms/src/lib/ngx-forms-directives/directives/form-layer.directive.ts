import {Directive, effect, EmbeddedViewRef, input, InputSignal, TemplateRef, ViewContainerRef} from '@angular/core';
import {FormLayerControls, IFormLayer} from "@juulsgaard/ngx-forms-core";

@Directive({
  selector: '[ngxFormLayer]',
  standalone: true
})
export class FormLayerDirective<T> {

  readonly layer: InputSignal<IFormLayer<T>> = input.required({alias: 'ngxFormLayer'});

  readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormLayerWhen'});

  view?: EmbeddedViewRef<FormLayerDirectiveContext<T>>;

  constructor(
    private templateRef: TemplateRef<FormLayerDirectiveContext<T>>,
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

  static ngTemplateContextGuard<T>(
    directive: FormLayerDirective<T>,
    context: unknown
  ): context is FormLayerDirectiveContext<T> {
    return true;
  }
}

interface FormLayerDirectiveContext<T> {
  ngxFormLayer: FormLayerControls<T>;
}
