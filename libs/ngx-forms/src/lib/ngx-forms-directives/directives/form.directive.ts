import {
  Directive, effect, EmbeddedViewRef, input, InputSignal, InputSignalWithTransform, TemplateRef, ViewContainerRef
} from '@angular/core';
import {FormLayerControls, IFormRoot} from "@juulsgaard/ngx-forms-core";

@Directive({
  selector: '[ngxForm]',
  standalone: true
})
export class FormDirective<T> {

  form: InputSignalWithTransform<
    IFormRoot<T>,
    IFormRoot<T> | { readonly form: IFormRoot<T> }
  > = input.required({
    alias: 'ngxForm',
    transform: (form: IFormRoot<T>|{readonly form: IFormRoot<T>}) => 'form' in form ? form.form : form
  });

  readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormWhen'});

  view?: EmbeddedViewRef<FormDirectiveContext<T>>

  constructor(
    private templateRef: TemplateRef<FormDirectiveContext<T>>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      if (!this.show()) {
        this.view?.destroy();
        this.view = undefined;
        return;
      }

      if (!this.view) {
        const context = {ngxForm: this.form().controls()};
        this.view = this.viewContainer.createEmbeddedView(this.templateRef, context);
        return;
      }

      this.view.context.ngxForm = this.form().controls();
      this.view.markForCheck();
    });
  }

  get control() {
    return this.form();
  }

  static ngTemplateContextGuard<T>(
    directive: FormDirective<T>,
    context: unknown
  ): context is FormDirectiveContext<T> {
    return true;
  }
}

interface FormDirectiveContext<T> {
  ngxForm: FormLayerControls<T>;
}
