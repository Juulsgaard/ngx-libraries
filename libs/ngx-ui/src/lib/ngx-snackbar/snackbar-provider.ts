import {Provider} from '@angular/core';
import {SnackbarManagerService, SnackbarService} from "./services";


export function provideSnackbarScope(): Provider[] {
  return [SnackbarManagerService, SnackbarService];
}
