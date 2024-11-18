import {Directive} from '@angular/core';

@Directive({
  selector: '[ngxListSuffix]',
  host: {'[class.ngx-list-suffix]': 'true'},
  standalone: true
})
export class NgxListSuffixDirective {

}
