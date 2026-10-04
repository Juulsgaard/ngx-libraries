import {booleanAttribute, Component, ElementRef, input, model, viewChild} from '@angular/core';
import {InputComponent, inputControl, InputControls, inputValue, NgxInputDirective} from '@juulsgaard/ngx-forms';
import {NoClickBubbleDirective} from '@juulsgaard/ngx-tools';
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/input";
import {FormInputErrorsComponent} from "../../components";
import {IconDirective} from "@juulsgaard/ngx-ui";
import {MatTooltip} from "@angular/material/tooltip";
import {FormsModule} from "@angular/forms";
import {IFormInput} from "@juulsgaard/ngx-forms-core";
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {ColorOption, NgxColorsTriggerDirective} from "ngx-colors";
import {InputDirection} from "../../helpers/types";

@Component({
  selector: 'form-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
  imports: [
    NoClickBubbleDirective,
    IconDirective,
    MatFormField,
    MatLabel,
    MatPrefix,
    MatSuffix,
    FormInputErrorsComponent,
    NgxInputDirective,
    IconDirective,
    MatTooltip,
    FormsModule,
    NgxColorsTriggerDirective
  ]
})
export class ColorInputComponent implements InputComponent<string | undefined> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<string>();
  readonly input = input<IFormInput<string | undefined>>();

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

  readonly control: InputControls<string | undefined> = inputControl(this);
  readonly model = inputValue(
    this.control,
    x => this.importValue(x),
    x => this.exportValue(x)
  );

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('outline');
  readonly direction = input<InputDirection>();

  readonly withAlpha = input(false, {transform: booleanAttribute});
  readonly palette = input<ColorOption[]>(colors);

  private exportValue(value: string | undefined): string | undefined {

    if (!value) return undefined;
    value = value.trim();

    if (value.search(/^#[\da-f]{6}$/i) >= 0) {
      return value.toUpperCase();
    }

    const alphaMatch = value.match(/^(#[\da-f]{6})[\da-f]{2}$/i);

    if (alphaMatch) {
      return this.withAlpha() ? alphaMatch[0]?.toUpperCase() : alphaMatch[1]?.toUpperCase();
    }

    return value;
  }

  private importValue(value: string | undefined): string | undefined {
    return value?.trim();
  }

}

const colors: ColorOption[] = [
  {
    name: "rojo", color: "#E57373", childs:
      ["#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828"]
  },
  {
    name: "rosa", color: "#F06292", childs:
      ["#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457"]
  },
  {
    name: "purpura", color: "#BA68C8", childs:
      ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A"]
  },
  {
    name: "purpura oscuro", color: "#9575CD", childs:
      ["#EDE7F6", "#D1C4E9", "#B39DDB", "#9575CD", "#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0"]
  },
  {
    name: "indigo", color: "#7986CB", childs:
      ["#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593"]
  },
  {
    name: "azul", color: "#64B5F6", childs:
      ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0"]
  },
  {
    name: "celeste", color: "#4FC3F7", childs:
      ["#E1F5FE", "#B3E5FC", "#81D4FA", "#4FC3F7", "#29B6F6", "#03A9F4", "#039BE5", "#0288D1", "#0277BD"]
  },
  {
    name: "cyan", color: "#4DD0E1", childs:
      ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4", "#00ACC1", "#0097A7", "#00838F"]
  },
  {
    name: "color", color: "#4DB6AC", childs:
      ["#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC", "#26A69A", "#009688", "#00897B", "#00796B", "#00695C"]
  },
  {
    name: "verde", color: "#81C784", childs:
      ["#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32"]
  },
  {
    name: "verde claro", color: "#AED581", childs:
      ["#F1F8E9", "#DCEDC8", "#C5E1A5", "#AED581", "#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F"]
  },
  {
    name: "lima", color: "#DCE775", childs:
      ["#F9FBE7", "#F0F4C3", "#E6EE9C", "#DCE775", "#D4E157", "#CDDC39", "#C0CA33", "#AFB42B", "#9E9D24"]
  },
  {
    name: "amarillo", color: "#FFF176", childs:
      ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825"]
  },
  {
    name: "ambar", color: "#FFD54F", childs:
      ["#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00"]
  },
  {
    name: "naranja", color: "#FFB74D", childs:
      ["#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00"]
  },
  {
    name: "naranja oscuro", color: "#FF8A65", childs:
      ["#FBE9E7", "#FFCCBC", "#FFAB91", "#FF8A65", "#FF7043", "#FF5722", "#F4511E", "#E64A19", "#D84315"]
  },
  {
    name: "marron", color: "#A1887F", childs:
      ["#EFEBE9", "#D7CCC8", "#BCAAA4", "#A1887F", "#8D6E63", "#795548", "#6D4C41", "#5D4037", "#4E342E"]
  },
  {
    name: "escala de grises", color: "#E0E0E0", childs:
      [
        "#FFFFFF",
        "#FAFAFA",
        "#F5F5F5",
        "#EEEEEE",
        "#E0E0E0",
        "#BDBDBD",
        "#9E9E9E",
        "#757575",
        "#616161",
        "#424242",
        "#000000"
      ]
  },
  {
    name: "azul gris", color: "#90A4AE", childs:
      ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#546E7A", "#455A64", "#37474F"]
  }
];
