import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NgIf} from "@angular/common";
import {SnackbarBaseComponent} from "../snackbar-base.component";
import {InfoSnackbarData} from "../../models/info-snackbar";
import {snackbarAnimation} from "@juulsgaard/ngx-tools";
import {mapObj} from "@juulsgaard/ts-tools";
import {Clipboard} from "@angular/cdk/clipboard";
import {IconButtonComponent} from "../../../buttons/components/icon-button/icon-button.component";
import {ButtonComponent} from "../../../buttons";

@Component({
  selector: 'ngx-info-snackbar',
  templateUrl: './info-snackbar.component.html',
  styleUrls: ['./info-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [snackbarAnimation()],
  standalone: true,
  imports: [
    NgIf,
    IconButtonComponent,
    ButtonComponent
  ]
})
export class InfoSnackbarComponent extends SnackbarBaseComponent<InfoSnackbarData> {

  private clipboard = inject(Clipboard);
  private extra = this.data.data;
  readonly canCopy = !!this.extra;

  constructor() {
    super();
  }

  copy() {
    if (!this.extra) return;

    this.clipboard.copy(JSON.stringify(
      {
        message: this.data.message,
        ...mapObj(this.extra, x => x),
        site: location.host
      })
    );
  }
}
