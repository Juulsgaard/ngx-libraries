import {
  booleanAttribute, ComponentRef, computed, Directive, effect, inject, input, InputSignal, InputSignalWithTransform,
  ViewContainerRef
} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {AnonFormNode} from "@juulsgaard/ngx-forms-core";
import {FormInputRegistry} from "../services";
import {BaseInputComponent} from "../lib/ngx-forms-tools";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form-input',
  standalone: true,
  host: {'[style.display]': '"none"'}
})
export class FormInputDirective {

  /** The input label */
  readonly label: InputSignal<string | undefined> = input<string>();

  /** A placeholder text, if not set the label will be used */
  readonly placeholder: InputSignal<string | undefined> = input<string>();

  /** Input to tell the browser what type of autocomplete the input should use */
  readonly autocomplete: InputSignal<string | undefined> = input<string>();

  /** Focus the input when it's first created */
  readonly autofocus: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  /** Add a tooltip with additional information about the input */
  readonly tooltip: InputSignal<string | undefined> = input<string>();

  /** Set the theme color for the input */
  readonly color: InputSignal<ThemePalette> = input<ThemePalette>('primary');

  /** Change the material input style */
  readonly appearance: InputSignal<MatFormFieldAppearance> = input<MatFormFieldAppearance>('outline');

  /** Hide the required asterisk */
  readonly direction: InputSignal<"ltr" | "rtl" | "auto" | undefined> = input<'ltr' | 'rtl' | 'auto'>();

  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly readonly: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly control: InputSignal<AnonFormNode | undefined> = input<AnonFormNode>();

  private registry = inject(FormInputRegistry);
  private viewContainer = inject(ViewContainerRef);
  private component?: ComponentRef<BaseInputComponent<unknown, unknown>>;

  constructor() {
    const componentType = computed(() => {
      const control = this.control();
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

    component.setInput('control', this.control());
    component.setInput('appearance', this.appearance());
    component.setInput('color', this.color());
    component.setInput('readonly', this.readonly());
    component.setInput('autocomplete', this.autocomplete());
    component.setInput('tooltip', this.tooltip());
    component.setInput('disabled', this.disabled());
    component.setInput('label', this.label());
    component.setInput('placeholder', this.placeholder());
    component.setInput('autofocus', this.autofocus());
    component.setInput('direction', this.direction());
  }
}

interface Context {
  control: AnonFormNode|undefined,
  appearance: "fill" | "outline";
  color: "primary" | "accent" | "warn" | undefined;
  readonly: boolean;
  autocomplete: string | undefined;
  tooltip: string | undefined;
  disabled: boolean;
  label: string | undefined;
  placeholder: string | undefined;
  autofocus: boolean;
  direction: "ltr" | "rtl" | "auto" | undefined
}
