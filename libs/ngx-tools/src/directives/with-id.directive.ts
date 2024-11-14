import {Directive, effect, ElementRef, HostListener, inject, input, InputSignal} from '@angular/core';
import {IdManagerService} from "../services";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[withId]',
  standalone: true
})
export class WithIdDirective {

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.service) return;
    if (!this.service.idCopyMode()) return;

    const id = this.id();
    if (!id) return;

    event.stopImmediatePropagation();
    this.service.copyId(id);
    return false;
  }

  readonly id: InputSignal<string | undefined> = input.required<string|undefined>({alias: 'withId'});

  private readonly service = inject(IdManagerService, {optional: true});

  constructor() {
    const service = this.service;
    if (!service) return;

    const element = inject(ElementRef<HTMLElement>).nativeElement;

    effect((onDestroy) => {
      element.classList.toggle('can-copy', service.idCopyMode());
      onDestroy(() => element.classList.remove('can-copy'));
    });
  }

}
