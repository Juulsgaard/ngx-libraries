import {Injectable} from '@angular/core';
import {NgxDragContext} from "../models/ngx-drag-context";

@Injectable({providedIn: 'root'})
export class NgxDragService {

  context?: NgxDragContext<unknown>;

  startDrag<T>(element: HTMLElement, data: T): NgxDragContext<T> {
    this.context?.dispose();

    const context = new NgxDragContext(element, data);
    this.context = context;

    return context;
  }

  deregister(context: NgxDragContext<unknown>) {
    if (context !== this.context) {
      context.dispose();
      return;
    }

    this.context.dispose();
    this.context = undefined;
  }
}
