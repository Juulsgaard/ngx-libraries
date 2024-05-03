import {NgxSideMenuTabContext} from "./menu-tab-context";
import {computed, DestroyRef, effect, inject, Injector, signal, Signal, untracked} from "@angular/core";
import {SideMenuManagerService} from "../services/side-menu-manager.service";
import {SideMenuInstance} from "./side-menu-instance";

export abstract class NgxSideMenuContext {

  abstract tab: Signal<NgxSideMenuTabContext|undefined>;
  abstract tabs: Signal<NgxSideMenuTabContext[]>;
  abstract showButtons: Signal<boolean>;
  readonly destroyed = signal(false);

  abstract openTab(slug: string): void;
  abstract close(): void;
  abstract toggleTab(tab: NgxSideMenuTabContext): void;

  private menuManager = inject(SideMenuManagerService);
  private injector = inject(Injector);
  private instance?: SideMenuInstance;

  protected constructor() {
    const hasTab = computed(() => this.tab() != null);

    effect(() => {

      if (hasTab()) {
        if (this.instance) return;
        this.instance = this.menuManager.createMenu(this, {}, this.injector);
        return;
      }

      if (!this.instance) return;
      const instance = this.instance;
      this.instance = undefined;
      untracked(() => this.menuManager.closeMenu(instance));
    });

    inject(DestroyRef).onDestroy(() => {
      this.destroyed.set(true);
      if (!this.instance) return;
      this.menuManager.closeMenu(this.instance);
    });
  }
}
