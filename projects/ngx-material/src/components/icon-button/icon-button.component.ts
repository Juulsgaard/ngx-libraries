import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {IconDirective} from "@juulsgaard/ngx-tools";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {BaseButton} from "../../models/base-button";

@Component({
  selector: 'ngx-icon-button, ngx-raised-icon-button',
  standalone: true,
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  imports: [
    IconDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[role]': '"button"', '[class.active]': 'active'}
})
export class IconButtonComponent extends BaseButton {

  @Input() icon?: string;
  @Input() alias?: string;

  @Input({transform: coerceBooleanProperty}) active = false;

  @Input() set size(size: number|string|undefined) {
    this.element.nativeElement.style.fontSize = size != undefined ? (typeof size === 'string' ? size : `${size}px`) : '';
  }

  @Input() set padding(padding: number|string|undefined) {
    this.element.nativeElement.style.setProperty(
      '--padding',
      padding ? (typeof padding === 'string' ? padding : `${padding}px`) : null
    );
  }

  constructor(private element: ElementRef<HTMLElement>) {
    super();
  }
}

