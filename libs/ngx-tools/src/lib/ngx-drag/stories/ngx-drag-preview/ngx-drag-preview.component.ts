import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgxDragEvent} from "../../models/ngx-drag-event";
import {NgxDragContext} from "../../models/ngx-drag-context";

@Component({
  selector: 'ngx-ngx-drag-preview',
  standalone: true,
  imports: [],
  templateUrl: './ngx-drag-preview.component.html',
  styleUrls: ['./ngx-drag-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxDragPreviewComponent {
  source = ['One', 'Two', 'Three'];
  destination: string[] = [];


  onDrop(event: NgxDragEvent<string>) {
    console.log('Drop', event);
    const index = this.source.findIndex(x => x === event.data);
    if (index < 0) return;
    this.destination.push(...this.source.splice(index, 1));
  }

  onStart(event: NgxDragContext<string>) {
    console.log('Drag start', event);
  }
}
