import {
  Directive, effect, EmbeddedViewRef, input, InputSignal, InputSignalWithTransform, TemplateRef, ViewContainerRef
} from '@angular/core';
import {FormRoot, FormUnit, isFormRoot} from "@juulsgaard/ngx-forms-core";

@Directive({
  selector: '[ngxForm]',
  standalone: true
})
export class FormDirective<TControls extends Record<string, FormUnit>> {

  form: InputSignalWithTransform<
    FormRoot<TControls, any>,
    FormRoot<TControls, any> | { readonly form: FormRoot<TControls, any> }
  > = input.required({
    alias: 'ngxForm',
    transform: (form: FormRoot<TControls, any>|{readonly form: FormRoot<TControls, any>}) => isFormRoot(form) ? form : form.form
  });

  readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormWhen'});

  view?: EmbeddedViewRef<FormDirectiveContext<TControls>>

  constructor(
    private templateRef: TemplateRef<FormDirectiveContext<TControls>>,
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

  static ngTemplateContextGuard<TControls extends Record<string, FormUnit>>(
    directive: FormDirective<TControls>,
    context: unknown
  ): context is FormDirectiveContext<TControls> {
    return true;
  }
}

interface FormDirectiveContext<TControls extends Record<string, FormUnit>> {
  ngxForm: TControls;
}
