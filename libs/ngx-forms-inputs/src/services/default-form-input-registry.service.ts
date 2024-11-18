import {FormInputConfig, provideFormInputs} from "@juulsgaard/ngx-forms";
import {InputTypes} from "@juulsgaard/ngx-forms-core";
import {
  BoolInputComponent, ColorInputComponent, DateInputComponent, DateTimeInputComponent, FileInputComponent,
  LongTextInputComponent, MatSelectInputComponent, MatSelectMultipleInputComponent, NumberInputComponent,
  PasswordInputComponent, TextInputComponent, TimeInputComponent
} from "../inputs";

export function provideDefaultFormInputs(builder?: (cfg: FormInputConfig) => void) {
  return provideFormInputs(cfg => {
    cfg.register(InputTypes.Text, TextInputComponent);
    cfg.register(InputTypes.Email, TextInputComponent);
    cfg.register(InputTypes.Phone, TextInputComponent);
    cfg.register(InputTypes.Url, TextInputComponent);

    cfg.register(InputTypes.LongText, LongTextInputComponent);
    cfg.register(InputTypes.Password, PasswordInputComponent);
    cfg.register(InputTypes.Color, ColorInputComponent);

    cfg.register(InputTypes.Bool, BoolInputComponent);

    cfg.register(InputTypes.File, FileInputComponent);

    cfg.register(InputTypes.Number, NumberInputComponent);

    cfg.register(InputTypes.Date, DateInputComponent);
    cfg.register(InputTypes.Time, TimeInputComponent);
    cfg.register(InputTypes.DateTime, DateTimeInputComponent);

    cfg.register(InputTypes.Select, MatSelectInputComponent);
    cfg.register(InputTypes.SelectMany, MatSelectMultipleInputComponent);

    builder?.(cfg);
  });
}
