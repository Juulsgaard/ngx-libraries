import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CreateAction} from "@juulsgaard/data-sources";
import {WithId} from "@juulsgaard/ts-tools";
import {CommonModule} from "@angular/common";
import {TruthyPipe} from "@juulsgaard/ngx-tools";
import {LoadingOverlayComponent} from "@juulsgaard/ngx-material";
import {NavCreateTileComponent} from "../nav-create-tile/nav-create-tile.component";
import {SelectionGridTileComponent} from "./selection-grid-tile/selection-grid-tile.component";
import {SelectionListContext} from "../../../models/selection-list-context";

@Component({
  selector: 'ngx-selection-grid',
  templateUrl: './selection-grid.component.html',
  styleUrls: ['./selection-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, NavCreateTileComponent, SelectionGridTileComponent, TruthyPipe, LoadingOverlayComponent]
})
export class SelectionGridComponent<TModel extends WithId> extends SelectionListContext<TModel> {
  @Input() noBlur = false;
  @Input() loading?: boolean;
  @Input() createActions: CreateAction[] = [];
}
