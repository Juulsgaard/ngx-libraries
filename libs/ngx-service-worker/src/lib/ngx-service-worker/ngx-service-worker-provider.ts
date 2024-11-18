import {Provider} from "@angular/core";
import {ServiceWorkerService} from "./services/service-worker.service";

export function provideServiceWorkerService(enabled: boolean): Provider {
  return {
    provide: ServiceWorkerService,
    useFactory: () => new ServiceWorkerService(enabled),
  }
}
