import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, NgZone, signal
} from '@angular/core';
import {FormPage} from "@juulsgaard/ngx-forms-core";
import {SimpleObject} from "@juulsgaard/ts-tools";
import {FormContext} from "../../lib/ngx-forms-tools";
import {filter, fromEvent, mergeWith, tap, throttleTime} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NgIf} from "@angular/common";
import {FormErrorsComponent} from "../form-errors/form-errors.component";
import {FormErrorStateComponent} from "../form-error-state/form-error-state.component";
import {ButtonComponent, NgxTabContext} from "@juulsgaard/ngx-ui";
import {LoadingDirective} from "@juulsgaard/ngx-tools";

@Component({
  selector: 'ngx-form-submit',
  standalone: true,
  imports: [
    NgIf,
    FormErrorsComponent,
    FormErrorStateComponent,
    ButtonComponent,
    LoadingDirective
  ],
  templateUrl: './form-submit.component.html',
  styleUrl: './form-submit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSubmitComponent<T extends SimpleObject> {

  readonly form: InputSignal<FormPage<T>> = input.required<FormPage<T>>();
  readonly disableShortcut = input(false, {transform: booleanAttribute});

  private tabContext = inject(NgxTabContext, {optional: true});
  private formContext = inject(FormContext, {optional: true});

  readonly showErrors = signal(false);
  readonly readonly = computed(() => this.formContext?.readonly() === true);

  constructor() {
    const zone = inject(NgZone);

    zone.runOutsideAngular(() => {

      const shortcut$ = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
        filter(e => !e.repeat),
        filter(e => e.key === 's'),
        filter(e => e.metaKey || e.ctrlKey)
      );

      const saveEvents$ = fromEvent<KeyboardEvent>(window, 'save');

      shortcut$.pipe(
        mergeWith(saveEvents$),
        filter(() => !this.disableShortcut()),
        filter(() => this.tabContext?.isActive() != false),
        tap(e => e.preventDefault()),
        throttleTime(1000),
        takeUntilDestroyed()
      ).subscribe(() => zone.run(() => this.onSubmit()));
    });
  }

  onSubmit() {
    if (this.readonly()) return;
    this.form().submit();
  }

  onDelete() {
    if (this.readonly()) return;
    this.form().delete();
  }

  onShowChange(show: boolean) {
    if (!show) return;
    this.form().form.markAsTouched();
  }
}
