import {booleanAttribute, Component, ElementRef, input, InputSignal, model, viewChild} from '@angular/core';
import {FileDropDirective, FileSizePipe} from "@juulsgaard/ngx-tools";
import {FormInputErrorsComponent} from "../../components";
import {ButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {InputComponent, inputControl, InputControls} from "@juulsgaard/ngx-forms";
import {IFormInput} from "@juulsgaard/ngx-forms-core";

@Component({
  selector: 'form-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  imports: [
    FileDropDirective,
    FileSizePipe,
    FileDropDirective,
    FileSizePipe,
    IconDirective,
    FormInputErrorsComponent,
    IconDirective,
    ButtonComponent,
    MatTooltip
  ]
})
export class FileInputComponent implements InputComponent<File | undefined> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<File>();
  readonly input = input<IFormInput<File|undefined>>();

  readonly element = viewChild('input', {read: ElementRef<HTMLElement>})

  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly tooltip = input<string>();
  readonly autocomplete = input<string>();

  readonly readonly = input(false, {transform: booleanAttribute});
  readonly disabled = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});

  readonly warning = input<string>();
  readonly error = input<string>();
  //</editor-fold>

  readonly control: InputControls<File | undefined> = inputControl(this);
  readonly model = this.control.value;

  readonly accept: InputSignal<string> = input('*');

  dropFile(event: DragEvent) {
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.model.set(file);
  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.value.set(file);
    input.value = '';
  }
}
