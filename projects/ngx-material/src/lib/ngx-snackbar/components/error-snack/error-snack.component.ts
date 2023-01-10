import {ChangeDetectionStrategy, Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {mapObj} from "@consensus-labs/ts-tools";
import {SnackBarData} from "../../models/snack-bar.model";
import {Clipboard} from "@angular/cdk/clipboard";
import {NgIf} from "@angular/common";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {IconDirective} from "@consensus-labs/ngx-tools";

@Component({
  selector: 'ngx-error-snack',
  templateUrl: './error-snack.component.html',
  styleUrls: ['../../styles/snackbar.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgIf,
    MatLegacyButtonModule,
    MatIconModule,
    IconDirective
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorSnackComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData,
    private snackRef: MatSnackBarRef<ErrorSnackComponent>,
    private clipboard: Clipboard
  ) {
  }

  dismiss() {
    this.snackRef.dismiss();
  }

  toClipboard() {
    this.clipboard.copy(JSON.stringify(
      {
        ...mapObj(this.data, x => x),
        site: location.host
      })
    );
  }
}
