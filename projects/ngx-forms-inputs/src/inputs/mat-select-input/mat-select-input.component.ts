import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Host, Input, Optional, SkipSelf} from '@angular/core';
import {ControlContainer, FormsModule} from "@angular/forms";
import {FormNode, isFormSelectNode, MultiSelectNode, SingleSelectNode} from "@consensus-labs/ngx-forms-core";
import {skip} from "rxjs";
import {harmonicaAnimation, IconDirective} from "@consensus-labs/ngx-tools";
import {BaseInputComponent, FormContext} from "@consensus-labs/ngx-forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatLegacyTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacySelectModule} from "@angular/material/legacy-select";
import {MatIconModule} from "@angular/material/icon";
import {Selection} from "@consensus-labs/ts-tools";

type ArrOrNullable<T> = T extends any[] ? T : T | undefined;

@Component({
  selector: 'form-mat-select',
  templateUrl: './mat-select-input.component.html',
  styleUrls: ['./mat-select-input.component.scss'],
  animations: [harmonicaAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatLegacySelectModule,
    AsyncPipe,
    NgIf,
    MatLegacyTooltipModule,
    NgForOf,
    MatIconModule,
    IconDirective
  ],
  standalone: true
})
export class MatSelectInputComponent<TItem, TVal extends any | any[]> extends BaseInputComponent<ArrOrNullable<TVal>, ArrOrNullable<TVal>> {

  hasExternalItems = false;

  @Input('items') set itemsData(items: TItem[]) {
    this.hasExternalItems = true;
    this.items = items;
  }

  items: TItem[] = [];

  get notEmpty() {
    return !this.hideEmpty || this.items.length > 0;
  }

  @Input() bindLabel?: string | Selection<TItem, string>;
  @Input() bindValue?: string | Selection<TItem, TVal>;

  @Input() multiple = false;

  @Input() clearable = true;
  @Input() hideEmpty = false;

  get canClear() {
    return (
      this.multiple || !this.required
    ) && this.clearable;
  }

  constructor(
    changes: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
    @Optional() formScope: FormContext
  ) {
    super(changes, controlContainer, formScope);
  }

  getLabel(item: TItem) {
    if (!this.bindLabel) return item;
    if (this.bindLabel instanceof Function) return this.bindLabel(item);
    return (
      item as any
    )[this.bindLabel];
  }

  getValue(item: TItem) {
    if (!this.bindValue) return item;
    if (this.bindValue instanceof Function) return this.bindValue(item);
    return (
      item as any
    )[this.bindValue];
  }

  override loadFormNode(n: FormNode<ArrOrNullable<TVal>>) {
    super.loadFormNode(n);

    if (!isFormSelectNode(n)) return;
    const node = n as SingleSelectNode<TVal, TItem>|MultiSelectNode<TVal, TItem>;

    this.bindLabel = node.bindLabel ?? this.bindLabel;
    this.bindValue = node.bindValue ?? this.bindValue;
    this.multiple = node.multiple ?? this.multiple;
    this.clearable = node.clearable ?? this.clearable;
    this.hideEmpty = node.hideWhenEmpty ?? this.hideEmpty;

    if (node.items$) {
      this.subscriptions.add(
        node.items$.pipe(
          skip(this.hasExternalItems ? 1 : 0)
        ).subscribe(items => {
          this.items = items;
          this.changes.detectChanges();
        })
      );
    }
  }

  trackBy = (index: number, item: TItem) => this.getValue(item);

  postprocessValue(value: ArrOrNullable<TVal>) {
    if (!value) return this.multiple ? [] as TVal : undefined;
    if (this.multiple) {
      return Array.isArray(value) ? value : [value] as TVal;
    }
    return Array.isArray(value) ? value[0] : value;
  }

  preprocessValue(value: ArrOrNullable<TVal> | undefined) {
    if (!value) return this.multiple ? [] as TVal : undefined;
    if (this.multiple) {
      return Array.isArray(value) ? value : [value] as TVal;
    }
    return Array.isArray(value) ? value[0] : value;
  }

}
