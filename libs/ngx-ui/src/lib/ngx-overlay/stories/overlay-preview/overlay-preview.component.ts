import {Component, EventEmitter, Input, model, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {OverlayDirective} from "../../directives/overlay.directive";
import {OverlayOutletDirective} from "../../directives/overlay-outlet.directive";

@Component({
  selector: 'ngx-overlay-preview',
  standalone: true,
  imports: [
    MatButtonModule,
    OverlayOutletDirective,
    OverlayDirective,
  ],
  templateUrl: './overlay-preview.component.html',
  styleUrls: ['./overlay-preview.component.css']
})
export class OverlayPreviewComponent {
  show = model(true);
  @Input() scrollable = false;
  @Input() content = 'This is the contents of the Overlay';

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
    this.show.set(false);
  }
}
