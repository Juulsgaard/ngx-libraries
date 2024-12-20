import {ChangeDetectionStrategy, Component, inject, LOCALE_ID} from '@angular/core';
import {NgxMatTimepickerComponent} from "ngx-mat-timepicker";
import {harmonicaAnimation, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {NgIf} from "@angular/common";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/input";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {FormInputErrorsComponent} from "../../components";
import {IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";

dayjs.extend(utc);

@Component({
  selector: 'form-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NoClickBubbleDirective,
    MatFormField,
    MatLabel,
    MatPrefix,
    MatSuffix,
    NgIf,
    IconDirective,
    IconButtonComponent,
    FormInputErrorsComponent,
    NgxInputDirective,
    IconDirective,
    MatTooltip,
    IconButtonComponent,
    NgxMatTimepickerComponent,
  ],
  standalone: true
})
export class TimeInputComponent extends BaseInputComponent<Date, string | undefined> {

  timeFormat: 12|24;
  locale = inject(LOCALE_ID);

  constructor() {
    super();

    this.timeFormat = new Date(0)
      .toLocaleTimeString(this.locale, {hour: 'numeric'})
      .match(/AM|PM/) ? 12 : 24;
  }

  preprocessValue(value: Date | undefined): string | undefined {
    if (!value) return undefined;
    const date = new Date(value)
    return date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit", timeZone: 'utc'})
  }

  postprocessValue(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    const date = dayjs(`1970-01-01 ${value}`).utc(true)

    this.inputError.set(!date.isValid() ? 'Invalid Time Format' : undefined);
    if (!date.isValid()) return undefined;
    return date.toDate();
  }

  pickTime(time: string) {
    this.value = time;
  }

  openPicker(picker: NgxMatTimepickerComponent) {
    const externalValue = this.externalValue();
    const date = externalValue ? new Date(externalValue) : new Date('1970-01-01T12:00:00Z');
    picker.defaultTime = date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit", timeZone: 'utc'});
    picker.open();
  }
}
