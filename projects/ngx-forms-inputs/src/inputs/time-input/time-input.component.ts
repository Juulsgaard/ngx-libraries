import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Inject, LOCALE_ID, Optional, SkipSelf
} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import {NgxMatTimepickerComponent, NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {harmonicaAnimation, IconDirective, NoClickBubbleDirective} from "@consensus-labs/ngx-tools";
import {BaseInputComponent, FormContext} from '@consensus-labs/ngx-forms';
import {AsyncPipe, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {MatLegacyRippleModule} from "@angular/material/legacy-core";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'form-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatLegacyInputModule,
    NoClickBubbleDirective,
    NgxMatTimepickerModule,
    FormsModule,
    MatLegacyTooltipModule,
    MatLegacyRippleModule,
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
  ],
  standalone: true
})
export class TimeInputComponent extends BaseInputComponent<Date|undefined, string | undefined> {

  timeFormat: 12|24;

  constructor(
    changes: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
    @Optional() formScope: FormContext,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super(changes, controlContainer, formScope);

    this.timeFormat = new Date(0)
      .toLocaleTimeString(locale, {hour: 'numeric'})
      .match(/AM|PM/) ? 12 : 24;
  }

  preprocessValue(value: Date | undefined): string | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    date.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit"})
  }

  postprocessValue(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    const date = new Date(`1970-1-1 ${value}`);
    const invalid = isNaN(date.getTime());

    this.inputError = invalid ? 'Invalid Time Format' : undefined;
    if (invalid) return undefined;

    date.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds());
    return date;
  }

  pickTime(time: string) {
    this.inputValue = time;
  }

  openPicker(picker: NgxMatTimepickerComponent) {
    const date = new Date(this.externalValue ?? '1970-1-1 12:00:00');
    date.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    picker.defaultTime = date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit"});
    picker.open();
  }
}
