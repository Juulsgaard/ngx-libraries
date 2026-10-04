import {Directive, effect, EmbeddedViewRef, input, InputSignal, TemplateRef, ViewContainerRef} from "@angular/core";
import {FormLayerControls, IFormLayer, IFormList} from "@juulsgaard/ngx-forms-core";
import {arrToSet} from "@juulsgaard/ts-tools";

@Directive({
  selector: '[ngxFormList][ngxFormListIn]',
  standalone: true
})
export class FormListDirective<T> {

  readonly list: InputSignal<IFormList<T>> = input.required<IFormList<T>>({alias: 'ngxFormListIn'});

  readonly show: InputSignal<boolean> = input(true, {alias: 'ngxFormListWhen'});

  views = new Map<IFormLayer<T>, EmbeddedViewRef<FormListDirectiveContext<T>>>();

  constructor(
    private templateRef: TemplateRef<FormListDirectiveContext<T>>,
    private viewContainer: ViewContainerRef
  ) {

    effect(() => {
      if (!this.show()) {
        this.clear();
        return;
      }

      const list = this.list();
      const controls = list.controls();
      const controlList = controls.map(x => x.controls());
      const controlSet = arrToSet(controls);

      // Remove outdated views
      for (const [layer, view] of this.views) {
        if (controlSet.has(layer)) continue;
        view.destroy();
        this.views.delete(layer);
      }

      // Insert or update views
      let index = -1;
      for (const control of controlSet) {
        index++;
        let view = this.views.get(control);

        if (view) {
          this.viewContainer.move(view, index);
          const changed = view.context.update(control, index, controlList);
          if (changed) view.markForCheck();
          continue;
        }

        const context = new FormListDirectiveContext(control, index, controlList);
        view = this.viewContainer.createEmbeddedView(this.templateRef, context, {index});
        this.views.set(control, view);
      }
    });
  }

  private clear() {
    for (const [_, view] of this.views) {
      view.destroy();
    }
    this.views.clear();
  }

  static ngTemplateContextGuard<T>(
    directive: FormListDirective<T>,
    context: unknown
  ): context is FormListDirectiveContext<T> {
    return true;
  }
}

class FormListDirectiveContext<T> {

  $implicit: FormLayerControls<T>;
  ngxFormListIn: FormLayerControls<T>[];
  index: number;
  layer: IFormLayer<T>;

  constructor(layer: IFormLayer<T>, index: number, list: FormLayerControls<T>[]) {
    this.layer = layer;
    this.$implicit = layer.controls();
    this.index = index;
    this.ngxFormListIn = list;
  }

  update(layer: IFormLayer<T>, index: number, list:  FormLayerControls<T>[]): boolean {
    let changed = false;

    if (this.layer != layer) {
      this.layer = layer;
      changed = true;
    }

    const controls = layer.controls();
    if (this.$implicit !== controls) {
      this.$implicit = controls;
      changed = true;
    }

    if (this.index != index) {
      this.index = index;
      changed = true;
    }

    if (this.ngxFormListIn != list) {
      this.ngxFormListIn = list;
      changed = true;
    }

    return changed;
  }
}
