import {assertInInjectionContext, ElementRef, inject, Injector} from "@angular/core";
import {ElementClasses, ElementClassManager} from "@juulsgaard/ts-tools";

interface ElementClassManagerOptions<T extends HTMLElement = HTMLElement> {
  /** Manually provide the element to apply classes to */
  element?: T|ElementRef<T>;
  /** Default classes to populate on init */
  initialClasses?: ElementClasses,
  /** Optionally provide an injector for when running outside an injection context */
  injector?: Injector;
}

/**
 * Create a class manager that will manage the classes on an HTML Element.
 * If no element is passed via options, then the current injection context will be used to procure the element.
 * @param options - Options
 */
export function elementClassManager<T extends HTMLElement = HTMLElement>(options?: ElementClassManagerOptions<T>): ElementClassManager {

  const injector = options?.injector;

  const needsInjection = !options?.element;
  if (needsInjection && !injector) assertInInjectionContext(elementClassManager);

  const elementRef = options?.element ?? injector?.get(ElementRef<HTMLElement>) ?? inject(ElementRef<HTMLElement>);
  const element: T = elementRef instanceof ElementRef ? elementRef.nativeElement : elementRef;

  return new ElementClassManager<T>(element, options?.initialClasses);
}
