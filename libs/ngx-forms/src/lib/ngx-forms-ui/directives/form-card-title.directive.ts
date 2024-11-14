import {Directive} from '@angular/core';

@Directive({
  selector: '[form-card-title]',
  host: {class: 'ngx-form-card-title'}
})
export class NgxFormCardTitleDirective {
  constructor() {
  }
}
