import {booleanAttribute, Component, ElementRef, inject, input, LOCALE_ID, model, viewChild} from '@angular/core';
import {NgxMatTimepickerComponent} from "ngx-mat-timepicker";
import {NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {proxySignal} from "@juulsgaard/signal-tools";
import {InputComponent, inputControl, InputControls, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/input";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {FormInputErrorsComponent} from "../../components";
import {IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {InputDirection} from "../../helpers/types";

dayjs.extend(utc);

@Component({
  selector: 'form-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  imports: [
    NoClickBubbleDirective,
    MatFormField,
    MatLabel,
    MatPrefix,
    MatSuffix,
    IconDirective,
    IconButtonComponent,
    FormInputErrorsComponent,
    NgxInputDirective,
    IconDirective,
    MatTooltip,
    IconButtonComponent,
    NgxMatTimepickerComponent,
  ]
})
export class TimeInputComponent implements InputComponent<Date | undefined> {

  timeFormat: 12 | 24;
  locale = inject(LOCALE_ID);

  //<editor-fold desc="Processed Inputs">
  readonly value = model<Date>();
  readonly input = input<IFormInput<Date | undefined>>();

  readonly element = viewChild('input', {read: ElementRef<HTMLElement>})

  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly tooltip = input<string>();
  readonly autocomplete = input<string>();

  readonly readonly = input(false, {transform: booleanAttribute});
  readonly disabled = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});
  readonly autoFocus = input(false, {transform: booleanAttribute});

  readonly warning = input<string>();
  readonly error = input<string>();
  //</editor-fold>

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('outline');
  readonly direction = input<InputDirection>();

  readonly control: InputControls<Date | undefined> = inputControl(this);
  readonly model = proxySignal(
    this.control.value,
    (value: Date | undefined) => {
      if (!value) return undefined;
      const date = new Date(value)
      return date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit", timeZone: 'utc'})
    },
    (value, setError) => {
      if (!value) return undefined;
      const date = dayjs(`1970-01-01 ${value}`).utc(true)
      if (!date.isValid()) {
        setError('Invalid Time Format');
        return undefined;
      }
      return date.toDate();
    }
  );

  constructor() {
    this.timeFormat = new Date(0)
      .toLocaleTimeString(this.locale, {hour: 'numeric'})
      .match(/AM|PM/) ? 12 : 24;
  }

  pickTime(time: string) {
    this.model.set(time);
  }

  openPicker(picker: NgxMatTimepickerComponent) {
    const externalValue = this.control.value();
    const date = externalValue ? new Date(externalValue) : new Date('1970-01-01T12:00:00Z');
    picker.defaultTime = date.toLocaleTimeString(this.locale, {hour: "2-digit", minute: "2-digit", timeZone: 'utc'});
    picker.open();
  }
}
