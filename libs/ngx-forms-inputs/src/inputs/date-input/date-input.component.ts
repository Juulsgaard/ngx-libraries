import {
  booleanAttribute, Component, computed, ElementRef, inject, Injector, input, model, viewChild
} from '@angular/core';
import dayjs, {Dayjs} from "dayjs";
import {NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ThemePalette} from "@angular/material/core";
import {DayjsDateAdapter, MAT_DAYJS_DATE_FORMATS} from "../../adapters/date-adapter";
import {InputComponent, inputControl, InputControls, inputValue, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {MatFormField, MatLabel, MatPrefix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {DayjsHelper} from "../../helpers/dayjs-helper";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DatePickerDialogComponent} from "../../components/date-picker-dialog/date-picker-dialog.component";
import {Subscription} from "rxjs";
import {IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {proxySignal} from "@juulsgaard/signal-tools";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {InputDirection} from "../../helpers/types";

@Component({
  selector: 'form-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  imports: [
    IconDirective,
    FormInputErrorsComponent,
    NgxInputDirective,
    MatFormField,
    MatLabel,
    MatPrefix,
    IconButtonComponent,
    NoClickBubbleDirective,
    IconDirective,
    MatTooltip,
    IconButtonComponent
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_DAYJS_DATE_FORMATS
    }
  ]
})
export class DateInputComponent implements InputComponent<Date | undefined> {

  private injector = inject(Injector);
  private dialog = inject(MatDialog);
  private helper = new DayjsHelper();

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
    (x: Dayjs | undefined) => x?.format('L'),
    (val, setError) => {
      const date = val ? this.helper.parseDateStr(val).utc(true) : undefined;
      if (date && !date.isValid()) setError('Invalid Date Format');
      return date?.isValid() ? date : undefined;
    }
  );

  readonly localError = computed(() => this.textValue.error()?.message);

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
        this.model.set(date);
      })
    );

    this.datePickerSub.add(
      this.datePickerRef.afterClosed().subscribe(() => this.datePickerRef = undefined)
    );
  }
}
