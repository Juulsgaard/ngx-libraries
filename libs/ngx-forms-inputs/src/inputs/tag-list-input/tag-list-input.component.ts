import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, input, InputSignalWithTransform, Signal, signal,
  viewChild, viewChildren
} from '@angular/core';
import {BaseMultiSelectInputComponent, FormSelectValue, NgxInputDirective} from "@juulsgaard/ngx-forms";
import {
  harmonicaAnimation, NgxDragEvent, NgxDragModule, NgxDragService, NoClickBubbleDirective
} from "@juulsgaard/ngx-tools";
import {
  MatAutocomplete, MatAutocompleteOrigin, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption
} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/input";
import {arrToSet, isString} from "@juulsgaard/ts-tools";
import {FormInputErrorsComponent} from "../../components";
import {MatTooltip} from "@angular/material/tooltip";
import {ChipComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {NgIf} from "@angular/common";
import {throttledSignal} from "@juulsgaard/signal-tools";
import Fuse from "fuse.js";

@Component({
  selector: 'form-tag-list-input',
  standalone: true,
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
    NgIf,
    MatAutocompleteOrigin,
    ChipComponent,
    NgxDragModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption
  ],
  providers: [NgxDragService],
  animations: [harmonicaAnimation()],
  templateUrl: './tag-list-input.component.html',
  styleUrls: ['./tag-list-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListInputComponent<TItem> extends BaseMultiSelectInputComponent<string, TItem, string[]> {

  declare inputElement: Signal<HTMLInputElement | undefined>;

  readonly chips = viewChildren(ChipComponent);
  readonly canReorder: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly query = signal('');

  readonly floatLabel = computed(() => this.value.length ? 'always' : 'auto');

  readonly options: Signal<Options>;

  constructor() {
    super();

    const query = throttledSignal(this.query, 500);
    const blacklist = computed(() => arrToSet(this.value));

    const searcher = new Fuse<FormSelectValue<TItem, string>>(
      [],
      {includeScore: true, isCaseSensitive: true, keys: ['name']}
    );
    const filtered = computed(() => {
      const _blacklist = blacklist();
      const items = _blacklist.size ? this.mappedItems().filter(x => !_blacklist.has(x.id)) : this.mappedItems();
      searcher.setCollection(items);
      return items;
    });

    this.options = computed(() => {
      const _query = query();
      if (!_query.length) return {options: filtered()};

      const result = searcher.search(_query);
      const match = result.find(x => x.score === 0)?.item;
      const options = match
        ? result.filter(x => x.item !== match).map(x => x.item)
        : result.map(x => x.item);

      return {
        match,
        query: match ? undefined : _query,
        options
      }
    });
  }

  postprocessValue(value: string[]): string[] | undefined {
    return value.length < 1 ? undefined : value;
  }

  preprocessValue(value: string[] | undefined): string[] {
    return value ?? [];
  }

  removeTag(tag: string) {
    const index = this.value.findIndex(x => x === tag);
    if (index < 0) return;

    const list = [...this.value];
    list.splice(index, 1);
    this.value = list;
    this.markAsTouched();

    const input = this.inputElement();
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
      if (!this.value.includes(value)) {
        this.value = [...this.value, value];
      }
    }

    this.query.set('');
    const input = this.inputElement();
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
    this.markAsTouched();

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const rightSide = event.clientX > rect.x + rect.width / 2;
    this.move(event.data, rightSide ? index + 1 : index);
  }

  private move(from: number, to: number) {
    if (to === from || to === from + 1) return;
    const list = [...this.value];

    if (to < from) {
      list.splice(to, 0, ...list.splice(from, 1));
    } else {
      list.splice(to - 1, 0, ...list.splice(from, 1));
    }

    this.value = list;
  }
}

interface Options {
  match?: FormSelectValue<unknown, string>;
  query?: string;
  options: FormSelectValue<unknown, string>[];
}
