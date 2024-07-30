import {Disposable} from "@juulsgaard/ts-tools";
import {deepCloneNode, getTransform, matchElementSize, MoveEvent, Position} from "./misc.models";

export class NgxDragContext<T> implements Disposable {

  readonly startedAt = Date.now();

  private _disposed = false;
  get dragging() {return !this._disposed}

  private preview: HTMLElement;
  readonly touch: boolean

  constructor(readonly element: HTMLElement, readonly data: T, firstEvent: MoveEvent, private readonly offset: Position) {
    this.touch = firstEvent.touch;

    element.classList.add('ngx-dragging');

    this.preview = deepCloneNode(this.element);
    matchElementSize(this.preview, this.element.getBoundingClientRect());
    this.preview.classList.add('ngx-drag-preview');
    document.body.append(this.preview);
  }

  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;

    this.element.classList.remove('ngx-dragging');
    document.body.removeChild(this.preview);
  }

  updatePreview(position: Position) {
    this.preview.style.transform = getTransform(position.x - this.offset.x, position.y - this.offset.y);
  }
}

export class NgxDragStartContext<T> {

  get data() {
    return this._data
  };

  constructor(readonly element: HTMLElement, private _data: T | undefined) {

  }

  setData(data: T) {
    this._data = data;
  }
}
