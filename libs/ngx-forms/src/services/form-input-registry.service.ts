import {Provider, Type} from "@angular/core";
import {InputComponent} from "../lib/ngx-input-component";
import {FormInputType} from "@juulsgaard/ngx-forms-core";

export interface FormInputConfig {
  register<T>(type: FormInputType, component: Type<InputComponent<T>>): this;
}

class InternalFormInputConfig implements FormInputConfig {
  readonly map = new Map<FormInputType, Type<InputComponent<any>>>;

  register<T>(type: FormInputType, component: Type<InputComponent<T>>): this {
    this.map.set(type, component);
    return this;
  }
}

export class FormInputRegistry {

  constructor(private map: Map<FormInputType, Type<InputComponent<any>>>) {
  }

  getComponent(type: FormInputType) {
    return this.map.get(type);
  }
}

export function provideFormInputs(builder: (cfg: FormInputConfig) => void): Provider {
  const config = new InternalFormInputConfig();
  builder(config);
  return {provide: FormInputRegistry, useValue: new FormInputRegistry(config.map)}
}
