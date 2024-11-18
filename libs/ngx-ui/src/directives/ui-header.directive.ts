import {Directive, inject} from '@angular/core';
import {UIScopeContext} from "../models";
import {setElementClasses} from "@juulsgaard/ngx-tools";

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({selector: '[uiHeader]', standalone: true})
export class UiHeaderDirective {

  private uiContext = inject(UIScopeContext);

  constructor() {
    const header = this.uiContext.registerHeader();
    setElementClasses(() => header().classes);
  }
}
