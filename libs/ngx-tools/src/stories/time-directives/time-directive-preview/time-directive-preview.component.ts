import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CountdownDirective, CountdownOptions, TimeAgoDirective} from "../../../directives";
import {NgIf} from "@angular/common";

@Component({
  selector: 'ngx-time-directive-preview',
  standalone: true,
  imports: [CountdownDirective, TimeAgoDirective, NgIf],
  templateUrl: './time-directive-preview.component.html',
  styleUrls: ['./time-directive-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeDirectivePreviewComponent {

  @Input() countdown?: Date;
  @Input() timeAgo?: Date;
  @Input() options?: CountdownOptions = {countNegative: true};

}
