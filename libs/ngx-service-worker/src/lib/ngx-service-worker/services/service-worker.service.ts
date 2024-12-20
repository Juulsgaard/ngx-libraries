import {ApplicationRef, computed, inject, NgZone, signal, Signal} from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {filter, first, map, tap} from "rxjs/operators";
import {toSignal} from "@angular/core/rxjs-interop";

export class ServiceWorkerService {

  /** The app is in a broken state */
  readonly brokenState: Signal<boolean>;
  /** The app has an active SW */
  readonly serviceWorkerReady: Signal<boolean>;
  /** A new version is ready for install */
  readonly updateReady: Signal<boolean>;
  /** New version is downloading */
  readonly downloading: Signal<boolean>;

  /** The user can check for updates manually */
  readonly canCheckForUpdate: Signal<boolean>;
  /** The app is checking for updates */
  readonly checking: Signal<boolean>;

  /** True when the Service Worker is not in default state */
  readonly working: Signal<boolean>;

  private readonly workerUpdates = inject(SwUpdate);
  private readonly appRef = inject(ApplicationRef);
  private readonly zone = inject(NgZone);

  constructor(
    readonly enabled: boolean
  ) {

    this.serviceWorkerReady = toSignal(this.appRef.isStable.pipe(
      first(x => x),
      map(() => this.workerUpdates.isEnabled),
    ), {initialValue: false});

    this.updateReady = toSignal(this.workerUpdates.versionUpdates.pipe(
      first(x => x.type === 'VERSION_READY'),
      map(() => true),
    ), {initialValue: false});

    this.downloading = toSignal(this.workerUpdates.versionUpdates.pipe(
      filter(x => x.type === "VERSION_DETECTED" || x.type === "VERSION_READY"),
      map(x => x.type === "VERSION_DETECTED")
    ), {initialValue: false});

    this.brokenState = toSignal(this.workerUpdates.unrecoverable.pipe(
      first(),
      tap(e => console.error('Service worker reached an unrecoverable state:', e.reason)),
      map(() => true),
    ), {initialValue: false});

    this.checking = computed(() => this._checkingForUpdate() && !this.downloading());

    this.canCheckForUpdate = computed(() => this.serviceWorkerReady() && !this.updateReady() && !this.downloading() && !this._updateCooldown() && !this._checkingForUpdate())

    this.working = computed(() => this.updateReady() || this.downloading() || this.checking());
  }

  //<editor-fold desc="Check for Update">
  private _updateCooldown = signal(false);
  private _checkingForUpdate = signal(false);

  async checkForUpdate() {
    if (!this.workerUpdates.isEnabled) return;
    if (!this.canCheckForUpdate()) return;

    this._updateCooldown.set(true);
    this.zone.runOutsideAngular(() => setTimeout(
      () => this.zone.run(() => this._updateCooldown.set(false)),
      60000
    ));

    this._checkingForUpdate.set(true);

    try {
      await this.workerUpdates.checkForUpdate();
    } finally {
      this._checkingForUpdate.set(false);
    }
  }

  //</editor-fold>

  async updateApp() {
    if (!this.workerUpdates.isEnabled) return;
    if (this.updateReady()) {
      await this.workerUpdates.activateUpdate();
    }
    location.reload();
  }
}
