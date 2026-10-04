import {ChangeDetectionStrategy, Component} from '@angular/core';
import {formInput, formLayer, formPage, Validators} from "@juulsgaard/ngx-forms-core";
import {
  FormCardComponent, FormDirective, FormHeaderComponent, FormLayerDirective, FormSubmitComponent, FormWrapperComponent,
  NgxFormCardDescriptionDirective, NgxFormCardTitleDirective
} from "@juulsgaard/ngx-forms";
import {
  BoolInputComponent, DateInputComponent, DateTimeInputComponent, NumberInputComponent, TextInputComponent,
  TimeInputComponent
} from "../../../inputs";

@Component({
  selector: 'ngx-form-preview',
  standalone: true,
  imports: [
    FormHeaderComponent,
    TextInputComponent,
    BoolInputComponent,
    DateInputComponent,
    TimeInputComponent,
    FormSubmitComponent,
    DateTimeInputComponent,
    NumberInputComponent,
    FormWrapperComponent,
    FormCardComponent,
    NgxFormCardTitleDirective,
    NgxFormCardDescriptionDirective,
    FormLayerDirective,
    FormDirective
  ],
  templateUrl: './form-preview.component.html',
  styleUrl: './form-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPreviewComponent {

  form = formPage<FormValue>({
      bool: formInput.bool(true).withLabel('Enable Text Input').done(),
      str: formInput.text().withLabel('Text Input').required()
        .withErrors(Validators.minLength(2))
        .withWarnings(Validators.maxLength(10, 'Avoid making the text too long')).done(),
      layer: formLayer.build<LayerValue>({
        date: formInput.nullable.date().withLabel('Start Date').done(),
        time: formInput.nullable.time().withLabel('Start Time').done()
      }).withErrors(this.validate).done(),
      dateTime: formInput.datetime().required().withLabel('End Date and Time').done(),
      number: formInput.number().withLabel('Max participants')
        .withErrors(Validators.min(1), Validators.max(1000)).done(),
    })
    .withSubmit(x => console.log(x))
    .done();

  * validate(layer: LayerValue): Generator<string> {
    if (layer.date && layer.time) return;
    if (!layer.date && !layer.time) return;
    yield 'Both date and time need to be set';
  }

}

export interface FormValue {
  bool: boolean;
  str: string;
  dateTime: Date;
  number: number;
  layer: LayerValue;
}

interface LayerValue {
  date?: Date;
  time?: Date;
}
