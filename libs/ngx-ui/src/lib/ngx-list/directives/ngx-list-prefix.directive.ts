import {Directive} from '@angular/core';

@Directive({
  selector: '[ngxListPrefix]',
  host: {'[class.ngx-list-prefix]': 'true'},
  standalone: true
})
export class NgxListPrefixDirective {}
