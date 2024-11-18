import {
  booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, HostListener, input, InputSignalWithTransform,
  NgZone, Output
} from '@angular/core';
import {BaseInputComponent, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {fromEvent} from "rxjs";
import {filter} from "rxjs/operators";
import {NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {MatFormField, MatPrefix, MatSuffix} from "@angular/material/input";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IconButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";


@Component({
  selector: 'form-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ],
  standalone: true
})
export class SearchInputComponent extends BaseInputComponent<string, string|undefined> {

  @Output() submitted = new EventEmitter<string|undefined>();

  @HostListener('keydown.enter', ['$event'])
  onEnter() {
    if (!this.submitted.observed) return;
    this.submitted.emit(this.externalValue());
  }

  @HostListener('keydown.escape', ['$event'])
  escape(event: KeyboardEvent) {
    event.stopPropagation();
    this.value = '';
    this.inputElement()?.blur();
  }

  readonly globalFocus: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  constructor(zone: NgZone) {
    super();

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
        this.focus();
        this.value = this.value + e.key;
      }));
    })
  }

  postprocessValue(value: string|undefined): string | undefined {
    return value || undefined;
  }

  preprocessValue(value: string|undefined): string | undefined {
    return value;
  }

  clear() {
    this.value = undefined;
  }
}
