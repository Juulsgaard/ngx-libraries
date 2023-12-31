import {Disposable} from "@juulsgaard/ts-tools";
import {Unsubscribable} from "rxjs";
import {DestroyRef, inject} from "@angular/core";

export function Dispose<TClass>(
  init: Unsubscribable|Disposable|undefined,
  context: ClassFieldDecoratorContext<TClass, Unsubscribable|Disposable|undefined>
): void {
  context.addInitializer(function (this: TClass) {
    inject(DestroyRef).onDestroy(() => {
      const value = context.access.get(this);
      if (value == undefined) return;

      if ('unsubscribe' in value && typeof value.unsubscribe === 'function') {
        value.unsubscribe();
        return;
      }

      if ('dispose' in value && typeof value.dispose === 'function') {
        value.dispose();
        return;
      }
    })
  })
}
