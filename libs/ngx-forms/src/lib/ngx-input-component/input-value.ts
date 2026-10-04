import {isSignal, linkedSignal, WritableSignal} from "@angular/core";

import {InputControls} from "./input-control";

function ctor<TIn, T>(
  control: InputControls<TIn>,
  importFn: (input: TIn | undefined) => T,
  exportFn: (value: T) => TIn | undefined
): WritableSignal<T>;
function ctor<TIn, T>(
  value: WritableSignal<TIn>,
  importFn: (input: TIn | undefined) => T,
  exportFn: (value: T) => TIn | undefined
): WritableSignal<T>;
function ctor<TIn, T>(
  control: InputControls<TIn> | WritableSignal<TIn>,
  importFn: (input: TIn | undefined) => T,
  exportFn: (value: T) => TIn | undefined
): WritableSignal<T> {
  const input = isSignal(control) ? control : control.value;
  const value = linkedSignal(() => importFn(input()));
  value.set = x => input.set(exportFn(x));
  return value;
}

function nullable<T>(
  control: InputControls<T>,
  fallback: NonNullable<T>,
  nullCoalesce?: boolean
): WritableSignal<NonNullable<T>>;
function nullable<T>(
  value: WritableSignal<T>,
  fallback: NonNullable<T>,
  nullCoalesce?: boolean
): WritableSignal<NonNullable<T>>;
function nullable<T>(
  control: InputControls<T> | WritableSignal<T>,
  fallback: NonNullable<T>,
  nullCoalesce?: boolean
): WritableSignal<NonNullable<T>> {
  const input = isSignal(control) ? control : control.value;
  const value = linkedSignal(() => input() ?? fallback);
  value.set = x => input.set(nullCoalesce && x == fallback ? undefined : x);
  return value;
}

type InputValueFn = typeof ctor & {
  nullable: typeof nullable
};

ctor.nullable = nullable;


export const inputValue: InputValueFn = ctor;
