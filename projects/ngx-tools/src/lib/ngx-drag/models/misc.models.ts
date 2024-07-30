
export interface Position {
  x: number;
  y: number;
}

export class MoveEvent {
  touch: boolean;
  position: Position;

  constructor(event: MouseEvent | TouchEvent) {
    const touch = event instanceof TouchEvent;
    const pos = touch ? event.touches[0] ?? event.changedTouches[0]! : event

    this.touch = touch;
    this.position = {x: pos?.clientX, y: pos.clientY};
  }
}

/** Creates a deep clone of an element. */
export function deepCloneNode(node: HTMLElement): HTMLElement {
  const clone = node.cloneNode(true) as HTMLElement;
  const descendantsWithId = clone.querySelectorAll('[id]');

  // Remove the `id` to avoid having multiple elements with the same id on the page.
  clone.removeAttribute('id');
  descendantsWithId.forEach(x => x.removeAttribute('id'));

  return clone;
}

/**
 * Matches the target element's size to the source's size.
 * @param target Element that needs to be resized.
 * @param sourceRect Dimensions of the source element.
 */
export function matchElementSize(target: HTMLElement, sourceRect: DOMRect): void {
  target.style.width = `${sourceRect.width}px`;
  target.style.height = `${sourceRect.height}px`;
}

/**
 * Gets a 3d `transform` that can be applied to an element.
 */
export function getTransform(x: number, y: number): string {
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}
