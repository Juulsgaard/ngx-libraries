import {
  computed, Directive, effect, EmbeddedViewRef, input, InputSignalWithTransform, signal, TemplateRef, ViewContainerRef
} from "@angular/core";
import {FormLayerControls, IFormDialog, IFormRoot} from "@juulsgaard/ngx-forms-core";

/** Form rendering for a FormDialog. Can only be used inside Form Dialogs */
@Directive({selector: '[ngxDialogForm]', standalone: true})
export class FormDialogDirective<T> {

  form: InputSignalWithTransform<IFormRoot<T>, IFormDialog<T>> = input.required({
    alias: 'dialogForm',
    transform: (dialog: IFormDialog<T>) => dialog.form
  });

  private view?: EmbeddedViewRef<DialogFormContext<T>>;
  // Show toggle controlled by Dialog state
  readonly show = signal(false);

  constructor(
    public readonly viewContainer: ViewContainerRef,
    public readonly template: TemplateRef<DialogFormContext<T>>,
  ) {
    const controls = computed(() => this.form().controls());

    effect(() => {

      if (!this.show()) {
        this.view?.destroy();
        this.view = undefined;
        return;
      }

      const _controls = controls();

      if (!this.view) {
        this.view = this.viewContainer.createEmbeddedView(this.template, {dialogForm: _controls});
        return;
      }

      this.view.context.dialogForm = _controls;
      this.view.markForCheck();
    });
  }

  static ngTemplateContextGuard<T>(
    directive: FormDialogDirective<T>,
    context: unknown
  ): context is DialogFormContext<T> {
    return true;
  }
}

export interface DialogFormContext<T> {
  dialogForm: FormLayerControls<T>;
}
