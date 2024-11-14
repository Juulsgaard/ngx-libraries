import {Directive} from "@angular/core";

@Directive({
  selector: '[form-card-text]',
  host: {class: 'ngx-form-card-text'}
})
export class NgxFormCardTextDirective {
  constructor() {
  }
}
