import {
  computed, Directive, effect, EmbeddedViewRef, input, InputSignalWithTransform, signal, TemplateRef, ViewContainerRef
} from "@angular/core";
import {BaseFormDialog, FormRoot, FormUnit} from "@juulsgaard/ngx-forms-core";
import {SimpleObject} from "@juulsgaard/ts-tools";

/** Form rendering for a FormDialog. Can only be used inside Form Dialogs */
@Directive({selector: '[ngxDialogForm]', standalone: true})
export class FormDialogDirective<TControls extends Record<string, FormUnit>> {

  form: InputSignalWithTransform<
    FormRoot<TControls, SimpleObject>,
    BaseFormDialog<TControls, SimpleObject>
  > = input.required({
    alias: 'dialogForm',
    transform: (dialog: BaseFormDialog<TControls, SimpleObject>) => dialog.form
  });

  private view?: EmbeddedViewRef<DialogFormContext<TControls>>;
  // Show toggle controlled by Dialog state
  readonly show = signal(false);

  constructor(
    public readonly viewContainer: ViewContainerRef,
    public readonly template: TemplateRef<DialogFormContext<TControls>>,
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

  static ngTemplateContextGuard<TControls extends Record<string, FormUnit>>(
    directive: FormDialogDirective<TControls>,
    context: unknown
  ): context is DialogFormContext<TControls> {
    return true;
  }
}

export interface DialogFormContext<TControls extends Record<string, FormUnit>> {
  dialogForm: TControls;
}
