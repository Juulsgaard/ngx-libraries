import {
  booleanAttribute, Component, computed, ElementRef, input, model, Signal, signal, viewChild, viewChildren
} from '@angular/core';
import {
  inputValue, MultiSelectComponent, NgxInputDirective, selectControl, SelectControls, SelectOption
} from "@juulsgaard/ngx-forms";
import {NgxDragEvent, NgxDragModule, NgxDragService, NoClickBubbleDirective} from "@juulsgaard/ngx-tools";
import {
  MatAutocomplete, MatAutocompleteOrigin, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption
} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {arrToSet, isString, MapFunc} from "@juulsgaard/ts-tools";
import {FormInputErrorsComponent} from "../../components";
import {MatTooltip} from "@angular/material/tooltip";
import {ChipComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {ProxySignal, throttledSignal} from "@juulsgaard/signal-tools";
import Fuse from "fuse.js";
import {IFormMultiSelect} from "@juulsgaard/ngx-forms-core";
import {ThemePalette} from "@angular/material/core";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {InputDirection} from "../../helpers/types";

@Component({
  selector: 'form-tag-list-input',
  templateUrl: './tag-list-input.component.html',
  styleUrls: ['./tag-list-input.component.scss'],
  imports: [
    ChipComponent,
    IconDirective,
    MatFormField,
    MatLabel,
    MatSuffix,
    NoClickBubbleDirective,
    ChipComponent,
    FormInputErrorsComponent,
    NgxInputDirective,
    MatTooltip,
    IconDirective,
    MatAutocompleteOrigin,
    ChipComponent,
    NgxDragModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption
  ],
  providers: [NgxDragService]
})
export class TagListInputComponent<TItem> implements MultiSelectComponent<string, TItem> {

  //<editor-fold desc="Processed Inputs">
  readonly value = model<string[]>();
  readonly input = input<IFormMultiSelect<string, TItem>>();
  readonly items = input<TItem[]>();

  readonly element = viewChild('input', {read: ElementRef<HTMLInputElement>})

  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly tooltip = input<string>();

  readonly readonly = input(false, {transform: booleanAttribute});
  readonly disabled = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});

  readonly hideEmpty = input(false, {transform: booleanAttribute});
  readonly clearable = input(false, {transform: booleanAttribute});

  readonly bindValue = input<MapFunc<TItem, string>>();
  readonly bindLabel = input<MapFunc<TItem, string>>();
  readonly bindOption = input<MapFunc<TItem, string>>();

  readonly warning = input<string>();
  readonly error = input<string>();
  //</editor-fold>

  readonly control: SelectControls<string[], string, TItem> = selectControl(this);
  readonly model: ProxySignal<string[]> = inputValue.nullable(this.control, []);

  readonly color = input<ThemePalette>();
  readonly appearance = input<MatFormFieldAppearance>('outline');
  readonly direction = input<InputDirection>();

  readonly chips = viewChildren(ChipComponent);
  readonly canReorder = input(false, {transform: booleanAttribute});

  readonly query = signal('');
  readonly options: Signal<Options<TItem>>;

  readonly floatLabel = computed(() => this.model().length ? 'always' : 'auto');

  constructor() {
    const query = throttledSignal(this.query, 500);
    const denylist = computed(() => arrToSet(this.model()));

    const searcher = new Fuse<SelectOption<TItem, string>>(
      [],
      {includeScore: true, isCaseSensitive: true, keys: ['label']}
    );

    const filtered = computed(() => {
      const deny = denylist();
      const items = deny.size
        ? this.control.options().filter((x: SelectOption<TItem, string>) => !deny.has(x.value))
        : this.control.options();
      searcher.setCollection(items);
      return items;
    });

    this.options = computed((): Options<TItem> => {
      const _query = query();
      if (!_query.length) return {options: filtered()};

      const result = searcher.search(_query);
      const match = result.find(x => x.score === 0)?.item;
      const options = match
        ? result.filter(x => x.item !== match).map(x => x.item)
        : result.map(x => x.item);

      return {
        match: match,
        query: match ? undefined : _query,
        options: options
      }
    });
  }

  removeTag(tag: string) {
    const index = this.model().findIndex((x: string) => x === tag);
    if (index < 0) return;

    const list = [...this.model()];
    list.splice(index, 1);
    this.model.set(list);
    this.control.touch();

    const input = this.element()?.nativeElement;
    if (input) {
      input.focus();
      input.selectionStart = 0;
      input.selectionEnd = 0;
    }
  }

  readonly trigger = viewChild(MatAutocompleteTrigger);

  onSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;

    if (value && isString(value)) {
      if (!this.model().includes(value)) {
        this.model.update((x: string[]) => [...x, value]);
      }
    }

    this.query.set('');
    const input = this.element()?.nativeElement;
    if (input) input.value = '';
    setTimeout(() => this.trigger()?.openPanel(), 500);
  }

  onBackspace(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.selectionStart == null) return;
    if (input.selectionEnd == null) return;
    if (input.selectionStart !== input.selectionEnd) return;
    if (input.selectionStart > 0) return;

    const chip = this.chips().at(-1);
    if (!chip) return;
    chip.focusRemove();
  }

  getCanDrop(index: number) {
    return (context: NgxDragEvent<number>) => context.data !== index;
  }

  onDrop(event: NgxDragEvent<number>, index: number) {
    if (index === event.data) return;
    this.control.touch();

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const rightSide = event.clientX > rect.x + rect.width / 2;
    this.move(event.data, rightSide ? index + 1 : index);
  }

  private move(from: number, to: number) {
    if (to === from || to === from + 1) return;
    const list = [...this.model()];

    if (to < from) {
      list.splice(to, 0, ...list.splice(from, 1));
    } else {
      list.splice(to - 1, 0, ...list.splice(from, 1));
    }

    this.model.set(list);
  }
}

interface Options<TItem> {
  match?: SelectOption<TItem, string>;
  query?: string;
  options: SelectOption<TItem, string>[];
}
