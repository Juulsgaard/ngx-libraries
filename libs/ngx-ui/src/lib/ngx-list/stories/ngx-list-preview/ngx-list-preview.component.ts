import {Component} from '@angular/core';
import {NgxDividerComponent} from "../../../../components/divider/ngx-divider.component";
import {IconDirective} from "../../../icon";
import {NgxListComponent} from "../../components/ngx-list/ngx-list.component";
import {NgxListItemComponent} from "../../components/ngx-list-item/ngx-list-item.component";
import {NgxListSuffixDirective} from "../../directives/ngx-list-suffix.directive";
import {NgxListPrefixDirective} from "../../directives/ngx-list-prefix.directive";

@Component({
  selector: 'ngx-list-preview',
  standalone: true,
  imports: [
    IconDirective, NgxDividerComponent, NgxListComponent, NgxListItemComponent,
    NgxListSuffixDirective, NgxListPrefixDirective
  ],
  templateUrl: './ngx-list-preview.component.html',
  styleUrls: ['./ngx-list-preview.component.css']
})
export class NgxListPreviewComponent {

}
