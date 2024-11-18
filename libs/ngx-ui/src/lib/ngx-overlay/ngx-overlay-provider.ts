import {Provider, StaticProvider} from '@angular/core';
import {BASE_OVERLAY_PROVIDERS} from "./models/overlay-tokens";
import {OverlayManagerService} from "./services/overlay-manager.service";

export const provideOverlay = {
  withBaseProviders: (...providers: StaticProvider[]): Provider[] => [{provide: BASE_OVERLAY_PROVIDERS, useValue: providers}],
  asIsolatedScope: (...providers: StaticProvider[]): Provider[] => [{provide: BASE_OVERLAY_PROVIDERS, useValue: providers}, OverlayManagerService],
} as const;
