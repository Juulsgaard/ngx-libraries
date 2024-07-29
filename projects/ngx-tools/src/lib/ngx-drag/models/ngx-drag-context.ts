import {Disposable} from "@juulsgaard/ts-tools";

export class NgxDragContext<T> implements Disposable {

  private readonly _startedAt = Date.now();
  private _disposed = false;
  get dragging() {return !this._disposed}

  constructor(readonly element: HTMLElement, readonly data: T) {
    element.classList.add('ngx-dragging');
  }

  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;

    this.element.classList.remove('ngx-dragging');
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
