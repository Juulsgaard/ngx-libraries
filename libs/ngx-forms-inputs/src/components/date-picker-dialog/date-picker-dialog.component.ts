import {ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {Dayjs} from "dayjs";
import {ButtonComponent} from "@juulsgaard/ngx-ui";
import {MatCalendar} from "@angular/material/datepicker";

@Component({
  selector: 'ngx-date-picker-dialog',
  standalone: true,
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonComponent,
    MatDialogActions,
    MatCalendar,
    MatDialogClose
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerDialogComponent {

  readonly dialogRef = inject(MatDialogRef<DatePickerDialogComponent>)
  readonly data: Dayjs|undefined = inject(MAT_DIALOG_DATA);
  readonly date = signal<Dayjs|null>(this.data ?? null);

  select() {
    if (!this.date()) return;
    this.dialogRef.close(this.date());
  }
}
