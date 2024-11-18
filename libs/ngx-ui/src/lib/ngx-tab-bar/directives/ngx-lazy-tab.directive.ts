import {
  booleanAttribute, computed, Directive, effect, EmbeddedViewRef, forwardRef, inject, input, InputSignal,
  InputSignalWithTransform, TemplateRef, untracked, ViewContainerRef
} from "@angular/core";
import {NgxTabContext} from "../services";
import {titleCase} from "@juulsgaard/ts-tools";
import {provideUiScope} from "../../../models/ui-scope";

@Directive({
  selector: '[ngxLazyTab]',
  providers: [
    {provide: NgxTabContext, useExisting: forwardRef(() => NgxLazyTabDirective)},
    provideUiScope()
  ],
  standalone: true
})
export class NgxLazyTabDirective extends NgxTabContext {

  private templateRef = inject(TemplateRef<void>);
  private viewContainer = inject(ViewContainerRef);

  readonly slug: InputSignal<string> = input.required<string>({alias: 'ngxLazyTab'});
  readonly tabName: InputSignal<string | undefined> = input<string|undefined>(undefined, {alias: 'ngxLazyTabName'});
  readonly name = computed(() => this.tabName() ?? titleCase(this.slug()));

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'ngxLazyTabDisabled'});
  readonly hide: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute, alias: 'ngxLazyTabHide'});

  constructor() {
    super();
    effect(() => this.updateView(this.isOpen()));
  }

  view?: EmbeddedViewRef<void>;
  private updateView(show: boolean) {
    untracked(() => {
      if (this.view) {
        if (show) return;
        this.view.destroy();
        this.view = undefined;
        return;
      }

      if (!show) return;
      this.view = this.viewContainer.createEmbeddedView(this.templateRef);
      this.view.detectChanges();
      this.view.markForCheck();
    });
  }
}
