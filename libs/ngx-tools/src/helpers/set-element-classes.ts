import {ElementClasses, ElementClassManager, isFunction} from "@juulsgaard/ts-tools";
import {
  assertInInjectionContext, DestroyRef, effect, ElementRef, inject, Injector, isSignal, Signal
} from "@angular/core";
import {isObservable, Observable} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

interface SetElementClassesOptions<T extends HTMLElement = HTMLElement> {
  /** Manually provide the element to apply classes to */
  element?: T|ElementRef<T>;
  /** Optionally provide an injector for when running outside an injection context */
  injector?: Injector;
}

/**
 * Apply the given classes to an HTML Element.
 * If no element is passed via options, then the current injection context will be used to procure the element.
 * @param classes - Optional initial classes to apply
 * @param options - Options
 */
export function setElementClasses<T extends HTMLElement = HTMLElement>(
  classes: ElementClasses,
  options?: SetElementClassesOptions<T>
): void;
/**
 * Apply the given classes to an HTML Element.
 * If no element is passed via options, then the current injection context will be used to procure the element.
 * @param classes - A signal containing classes that will be applied to the HTML element
 * @param options - Options
 */
export function setElementClasses<T extends HTMLElement = HTMLElement>(
  classes: Signal<ElementClasses>,
  options?: SetElementClassesOptions<T>
): void;
/**
 * Apply the given classes to an HTML Element.
 * If no element is passed via options, then the current injection context will be used to procure the element.
 * @param computeClasses - A signal computation returning classes that will be applied to the HTML element
 * @param options - Options
 */
export function setElementClasses<T extends HTMLElement = HTMLElement>(
  computeClasses: () => ElementClasses,
  options?: SetElementClassesOptions<T>
): void;
/**
 * Apply the given classes to an HTML Element.
 * If no element is passed via options, then the current injection context will be used to procure the element.
 * @param classes$ - An observable containing classes that will be applied to the HTML element
 * @param options - Options
 */
export function setElementClasses<T extends HTMLElement = HTMLElement>(
  classes$: Observable<ElementClasses>,
  options?: SetElementClassesOptions<T>
): void;

export function setElementClasses<T extends HTMLElement = HTMLElement>(
  classes?: ElementClasses | Signal<ElementClasses> | (() => ElementClasses) | Observable<ElementClasses>,
  options?: SetElementClassesOptions<T>
): void {

  const injector = options?.injector;

  const needsInjection = isObservable(classes) || isSignal(classes) || !options?.element;
  if (needsInjection && !injector) assertInInjectionContext(setElementClasses);

  const elementRef = options?.element ?? injector?.get(ElementRef<HTMLElement>) ?? inject(ElementRef<HTMLElement>);
  const element = elementRef instanceof ElementRef ? elementRef.nativeElement : elementRef;

  if (isObservable(classes)) {
    const manager = new ElementClassManager(element);
    const destroy = injector?.get(DestroyRef) ?? inject(DestroyRef);
    classes.pipe(takeUntilDestroyed(destroy)).subscribe(x => manager.set(x));
    return;
  }

  if (isSignal(classes) || isFunction(classes)) {
    const manager = new ElementClassManager(element);
    effect(() => manager.set(classes()), {injector});
    return;
  }

  new ElementClassManager<T>(element, classes);
}
