import {ElementRef, Signal, WritableSignal} from "@angular/core";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {NgModel} from "@angular/forms";

export interface InputComponent<T> {
  readonly value: WritableSignal<T | undefined>;
  readonly input: Signal<IFormInput<T> | undefined>;

  readonly element?: Signal<ElementRef<HTMLElement | HTMLInputElement | HTMLTextAreaElement> | undefined>;
  readonly ngModels?: Signal<readonly NgModel[]>;

  readonly label?: Signal<string | undefined>;
  readonly placeholder?: Signal<string | undefined>;
  readonly tooltip?: Signal<string | undefined>;
  readonly autocomplete?: Signal<string | undefined>;

  readonly readonly?: Signal<boolean>;
  readonly disabled?: Signal<boolean>;
  readonly required?: Signal<boolean>;
  readonly autoFocus?: Signal<boolean>;

  readonly hideDisabled?: Signal<boolean>;

  readonly error?: Signal<string | undefined>;
  readonly warning?: Signal<string | undefined>;

  readonly localError?: Signal<string | undefined>;
  readonly localWarning?: Signal<string | undefined>;

  readonly focus?: (options?: FocusOptions) => void;
  readonly select?: () => void;
  readonly scrollTo?: () => void;
}

