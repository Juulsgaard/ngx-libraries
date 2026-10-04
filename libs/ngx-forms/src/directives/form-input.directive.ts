import {ComponentRef, computed, Directive, effect, inject, input, InputSignal, ViewContainerRef} from '@angular/core';
import {FormInputRegistry} from "../services";
import {IAnonFormInput, isFormInput} from "@juulsgaard/ngx-forms-core";
import {InputComponent} from "../lib/ngx-input-component";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form-input',
  standalone: true,
  host: {'[style.display]': '"none"'}
})
export class FormInputDirective {

  readonly input: InputSignal<IAnonFormInput | undefined> = input<IAnonFormInput>();

  private registry = inject(FormInputRegistry);
  private viewContainer = inject(ViewContainerRef);
  private component?: ComponentRef<InputComponent<unknown>>;

  constructor() {
    const componentType = computed(() => {
      const control = this.input();
      if (!control) return undefined;
      return this.registry.getComponent(control.type);
    });

    effect(() => {
      const _componentType = componentType();

      if (!_componentType) {
        this.component?.destroy();
        this.component = undefined;
        return;
      }

      if (!this.component) {
        this.component = this.viewContainer.createComponent(_componentType);
      } else if (this.component.componentType !== _componentType) {
        this.component.destroy();
        this.component = this.viewContainer.createComponent(_componentType);
      }

      this.updateComponentInputs();
    });
  }

  private updateComponentInputs() {
    const component = this.component;
    if (!component) return;

    const input = this.input();
    if (!isFormInput(input)) return undefined;

    component.setInput('control', input);
  }
}
