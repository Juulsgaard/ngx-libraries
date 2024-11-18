import {Provider, Signal, signal, Type, untracked} from "@angular/core";

export class SidebarService {

  private readonly _shown = signal(false)
  readonly shown: Signal<boolean> = this._shown.asReadonly();

  show() {
    this._shown.set(true);
  }

  hide() {
    this._shown.set(false);
  }

  toggle(show?: boolean) {
    if (untracked(this.shown)) {
      if (show === true) return;
      this.hide();
      return;
    }

    if (show === false) return;
    this.show();
  }

}

export function provideSidebarService(service?: Type<SidebarService>): Provider[] {
  if (!service) return [{provide: SidebarService}];

  return [
    service,
    {provide: SidebarService, useExisting: service},
  ];
}
