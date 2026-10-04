import {isSignal, WritableSignal} from "@angular/core";
import {InputControls} from "./input-controls";
import {proxySignal, ProxySignal} from "@juulsgaard/signal-tools";

function ctor<TIn, T>(
  control: InputControls<TIn>,
  importFn: (input: TIn | undefined) => T,
  exportFn: (value: T) => TIn | undefined
): ProxySignal<T>;
function ctor<TIn, T>(
  value: WritableSignal<TIn>,
  importFn: (input: TIn | undefined) => T,
  exportFn: (value: T) => TIn | undefined
): ProxySignal<T>;
function ctor<TIn, T>(
  control: InputControls<TIn> | WritableSignal<TIn>,
  importFn: (input: TIn | undefined) => T,
  exportFn: (value: T) => TIn | undefined
): ProxySignal<T> {
  const input = isSignal(control) ? control : control.value;
  return proxySignal(input, x => importFn(x), x => exportFn(x));
}

function nullable<T>(
  control: InputControls<T>,
  fallback: NonNullable<T>,
  nullCoalesce?: boolean
): ProxySignal<NonNullable<T>>;
function nullable<T>(
  value: WritableSignal<T>,
  fallback: NonNullable<T>,
  nullCoalesce?: boolean
): ProxySignal<NonNullable<T>>;
function nullable<T>(
  control: InputControls<T> | WritableSignal<T>,
  fallback: NonNullable<T>,
  nullCoalesce?: boolean
): ProxySignal<NonNullable<T>> {
  const input = isSignal(control) ? control : control.value;
  return proxySignal(input, x => x ?? fallback, x => nullCoalesce && x == fallback ? undefined : x);
}

type InputValue = {
  <TIn, T>(
    control: InputControls<TIn>,
    importFn: (input: TIn | undefined) => T,
    exportFn: (value: T) => TIn | undefined
  ): ProxySignal<T>;
  <TIn, T>(
    value: WritableSignal<TIn>,
    importFn: (input: TIn | undefined) => T,
    exportFn: (value: T) => TIn | undefined
  ): ProxySignal<T>;

  nullable: {
    <T>(
      control: InputControls<T>,
      fallback: NonNullable<T>,
      nullCoalesce?: boolean
    ): ProxySignal<NonNullable<T>>;
    <T>(
      value: WritableSignal<T>,
      fallback: NonNullable<T>,
      nullCoalesce?: boolean
    ): ProxySignal<NonNullable<T>>;
  }
}

ctor.nullable = nullable;


export const inputValue: InputValue = ctor;
