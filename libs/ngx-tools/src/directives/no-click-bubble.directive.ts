import {booleanAttribute, Directive, HostListener, input, InputSignalWithTransform} from '@angular/core';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[noClickBubble]',
  standalone: true
})
export class NoClickBubbleDirective {

  readonly noClickBubble: InputSignalWithTransform<boolean, unknown> = input.required({transform: booleanAttribute});

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.noClickBubble())
      event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.noClickBubble())
      event.stopPropagation();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.noClickBubble())
      event.stopPropagation();
  }
}
