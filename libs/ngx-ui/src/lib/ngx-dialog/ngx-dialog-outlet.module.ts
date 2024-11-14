import {NgModule} from '@angular/core';
import {DialogOutletDirective} from "./directives/dialog-outlet.directive";
import {RenderDialogComponent} from "./components/render-dialog/render-dialog.component";
import {NgxAsyncDirective, NgxIfDirective, NgxRenderingModule, TruthyPipe} from "@juulsgaard/ngx-tools";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ButtonComponent} from "../buttons";

@NgModule({
  imports: [
    NgxRenderingModule,
    NgIf,
    AsyncPipe,
    NgForOf,
    TruthyPipe,
    NgxAsyncDirective,
    NgxIfDirective,
    ButtonComponent
  ],
  exports: [DialogOutletDirective],
  declarations: [DialogOutletDirective, RenderDialogComponent],
  providers: [],
})
export class NgxDialogOutletModule {
}
