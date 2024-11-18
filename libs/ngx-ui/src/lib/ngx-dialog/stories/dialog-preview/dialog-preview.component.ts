import {Component, EventEmitter, Input, model, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {DialogComponent} from "../../components/dialog/dialog.component";
import {DialogOutletDirective} from "../../directives/dialog-outlet.directive";
import {DialogDirective} from "../../directives/dialog.directive";

@Component({
  selector: 'ngx-dialog-preview',
  templateUrl: './dialog-preview.component.html',
  styleUrls: ['./dialog-preview.component.css'],
  imports: [
    MatButtonModule,
    DialogOutletDirective,
    DialogComponent,
    DialogDirective,
  ],
  standalone: true
})
export class DialogPreviewComponent {
  show = model(true);
  showDirective = model(false);
  @Input() header = 'Header';
  @Input() text = 'Content';
  @Input() canClose = true;
  @Output() submitted = new EventEmitter<void>();

  close() {
    this.show.set(false);
    this.showDirective.set(false);
  }
}
