import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ServiceWorkerService} from "../../services/service-worker.service";
import {ButtonComponent, IconDirective} from "@juulsgaard/ngx-ui";
import {NgIf} from "@angular/common";

@Component({
  selector: 'ngx-sw-update-button',
  templateUrl: './sw-update-button.component.html',
  styleUrls: ['./sw-update-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconDirective,
    NgIf,
    ButtonComponent
  ],
  standalone: true
})
export class SwUpdateButtonComponent {

  constructor(public swService: ServiceWorkerService) {
  }

  async checkForUpdate() {
    await this.swService.checkForUpdate();
  }

  async updateApp() {
    await this.swService.updateApp();
  }
}
