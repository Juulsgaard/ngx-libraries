import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {BaseInputComponent} from '@juulsgaard/ngx-forms';
import {FileDropDirective, FileSizePipe} from "@juulsgaard/ngx-tools";
import {NgIf} from "@angular/common";
import {FormInputErrorsComponent} from "../../components";
import {ButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";

@Component({
  selector: 'form-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FileDropDirective,
    NgIf,
    FileSizePipe,
    FileDropDirective,
    FileSizePipe,
    IconDirective,
    FormInputErrorsComponent,
    IconDirective,
    ButtonComponent
  ],
  providers: []
})
export class FileInputComponent extends BaseInputComponent<File, File | undefined> {

  readonly accept: InputSignal<string> = input('*');

  constructor() {
    super();
  }

  preprocessValue(value: File | undefined) {
    return value;
  }

  postprocessValue(value: File | undefined) {
    return value ?? undefined;
  }

  dropFile(event: DragEvent) {
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    this.value = file;
  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.value = file;
    input.value = '';
  }

}
