import {
  booleanAttribute, Component, computed, DestroyRef, ElementRef, inject, Injector, input, LOCALE_ID, model, viewChild
} from '@angular/core';
import {InputComponent, inputControl, InputControls, inputValue, NgxInputDirective} from "@juulsgaard/ngx-forms";
import {NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {MatFormField, MatFormFieldAppearance} from "@angular/material/form-field";
import {MatTooltip} from "@angular/material/tooltip";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ThemePalette} from "@angular/material/core";
import {DayjsDateAdapter, MAT_DAYJS_DATETIME_FORMATS} from "../../adapters/date-adapter";
import {NgxMatTimepickerComponent} from "ngx-mat-timepicker";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DatePickerDialogComponent} from "../../components/date-picker-dialog/date-picker-dialog.component";
import {Subscription} from "rxjs";
import dayjs, {Dayjs} from "dayjs";
import utc from "dayjs/plugin/utc";
import {DayjsHelper} from "../../helpers/dayjs-helper";
import {MatLabel, MatPrefix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {InputDirection} from "../../helpers/types";
import {proxySignal} from "@juulsgaard/signal-tools";

dayjs.extend(utc);

@Component({
  selector: 'form-date-time-input',
  templateUrl: './date-time-input.component.html',
  styleUrls: ['./date-time-input.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatPrefix,
    IconDirective,
    MatTooltip,
    IconButtonComponent,
    NoClickBubbleDirective,
    NgxInputDirective,
    NgxMatTimepickerComponent,
    FormInputErrorsComponent,
    IconDirective,
    IconButtonComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_DAYJS_DATETIME_FORMATS
    }
  ]
})
export class DateTimeInputComponent implements InputComponent<Date | undefined> {

  private injector = inject(Injector);
  private dialog = inject(MatDialog);
  private locale = inject(LOCALE_ID);
  private helper = new DayjsHelper();

  readonly timeFormat: 12 | 24;
  readonly timePicker = viewChild.required(NgxMatTimepickerComponent);

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
  readonly model = inputValue(
    this.control,
    x => x && dayjs.utc(x),
    x => x?.toDate()
  );

  readonly textValue = proxySignal(
    this.model,
    (x: Dayjs | undefined) => x?.format('L LT'),
    (val, setError) => {
      const date = val ? this.helper.parseDateTimeStr(val).utc(true) : undefined;
      if (date && !date.isValid()) setError('Invalid Date/Time Format');
      return date?.isValid() ? date : undefined;
    }
  );

  readonly localError = computed(() => this.textValue.error()?.message);


  constructor() {
    this.timeFormat = new Date(0)
      .toLocaleTimeString(this.locale, {hour: 'numeric'})
      .match(/AM|PM/) ? 12 : 24;

    inject(DestroyRef).onDestroy(() => {
      this.datePickerSub?.unsubscribe();
      this.datePickerRef?.close();
    });
  }

  //<editor-fold desc="Date Picker">
  private datePickerRef?: MatDialogRef<DatePickerDialogComponent, Dayjs>;
  private datePickerSub?: Subscription;

  openDatePicker() {

    this.datePickerSub?.unsubscribe();
    this.datePickerRef?.close();

    this.datePickerRef = this.dialog.open(DatePickerDialogComponent, {
      injector: this.injector,
      width: '322px',
      data: this.value ?? dayjs().utc(true)
    });

    this.datePickerSub = new Subscription();

    this.datePickerSub.add(
      this.datePickerRef.beforeClosed().subscribe(date => {
        if (!date) return;

        const current = this.model();

        if (current) {
          date = date.set('hour', current.get('hour'))
            .set('minute', current.get('minute'))
            .set('second', current.get('second'))
            .set('millisecond', current.get('millisecond'));
        }

        this.model.set(date);
        this.openTimePicker();
      })
    );

    this.datePickerSub.add(
      this.datePickerRef.afterClosed().subscribe(val => this.datePickerRef = undefined)
    );
  }

  //</editor-fold>

  //<editor-fold desc="Time Picker">
  openTimePicker() {
    const picker = this.timePicker();
    if (!picker) return;

    const date = this.model() ?? dayjs.utc('1970-01-01T12:00:00Z');
    picker.defaultTime = date.format('LT');
    picker.open();
  }

  pickTime(time: string) {
    const value = dayjs(`1970-01-01 ${time}`).utc(true);
    const current = this.model() ?? dayjs.utc();

    const result = current.set('hour', value.get('hour'))
      .set('minute', value.get('minute'))
      .set('second', value.get('second'))
      .set('millisecond', value.get('millisecond'));

    this.model.set(result);
  }

  //</editor-fold>
}
