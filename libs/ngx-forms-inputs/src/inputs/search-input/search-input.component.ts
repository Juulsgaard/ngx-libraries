import {
  booleanAttribute, Component, ElementRef, HostListener, inject, input, model, NgZone, output, viewChild
} from '@angular/core';
import {InputComponent, inputControl, InputControls, inputValue, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {fromEvent} from "rxjs";
import {filter} from "rxjs/operators";
import {NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {MatFormField, MatPrefix, MatSuffix} from "@angular/material/input";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {InputDirection} from "../../helpers/types";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {ProxySignal} from "@juulsgaard/signal-tools";


@Component({
  selector: 'form-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  imports: [
    NoClickBubbleDirective,
    IconDirective,
    MatFormField,
    MatPrefix,
    MatSuffix,
    IconButtonComponent,
    NgxInputDirective,
    IconButtonComponent,
    IconDirective
  ]
})
export class SearchInputComponent implements InputComponent<string|undefined> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<string>();
  readonly input = input<IFormInput<string | undefined>>();

  readonly element = viewChild('input', {read: ElementRef<HTMLElement>})

  readonly placeholder = input<string>();
  readonly autocomplete = input<string>();

  readonly readonly = input(false, {transform: booleanAttribute});
  readonly disabled = input(false, {transform: booleanAttribute});
  readonly autoFocus = input(false, {transform: booleanAttribute});

  readonly warning = input<string>();
  readonly error = input<string>();
  //</editor-fold>

  readonly control: InputControls<string | undefined> = inputControl(this);
  readonly model: ProxySignal<string> = inputValue.nullable(this.control, '', true);

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('fill');
  readonly direction = input<InputDirection>();

  readonly submitted = output<string>();

  @HostListener('keydown.enter', ['$event'])
  onEnter(_event: Event) {
    this.submitted.emit(this.model());
  }

  @HostListener('keydown.escape', ['$event'])
  escape(event: Event) {
    event.stopPropagation();
    this.model.set('');
    this.element()?.nativeElement?.blur();
  }

  readonly globalFocus = input(false, {transform: booleanAttribute});

  constructor() {

    const zone = inject(NgZone);

    // Listen to key input that isn't in an input
    zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(window, 'keydown').pipe(
        filter(() => this.globalFocus()),
        filter(e => !e.altKey && !e.ctrlKey && !e.metaKey),
        filter(e => e.key.length === 1 && /\w/.test(e.key)),
        filter(() => document.activeElement?.tagName !== 'INPUT'
          && document.activeElement?.tagName !== 'TEXTAREA'
          && !document.activeElement?.hasAttribute('contenteditable')
        ),
        takeUntilDestroyed()
      ).subscribe(e => zone.run(() => {
        this.control.focus();
        this.model.update(x => x + e.key);
      }));
    })
  }

  clear() {
    this.model.set('');
  }
}
