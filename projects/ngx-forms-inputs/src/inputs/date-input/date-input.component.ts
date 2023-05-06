import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import dayjs, {Dayjs} from "dayjs";
import {harmonicaAnimation, IconDirective} from "@consensus-labs/ngx-tools";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {DayjsDateAdapter, MAT_DAYJS_DATE_FORMATS} from "../../adapters/date-adapter";
import {BaseInputComponent} from '@consensus-labs/ngx-forms';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'form-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatDatepickerModule,
    NgIf,
    AsyncPipe,
    MatIconModule,
    IconDirective,
    MatInputModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: DayjsDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_DATE_FORMATS}
  ]
})
export class DateInputComponent extends BaseInputComponent<Date | undefined, Dayjs | undefined> {

  constructor() {
    super();
  }

  postprocessValue(value?: Dayjs): Date | undefined {
    return value === undefined ? undefined : value.toDate();
  }

  preprocessValue(value?: Date): Dayjs | undefined {
    return value === undefined ? undefined : dayjs(value);
  }

}
