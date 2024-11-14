import {Pipe, PipeTransform} from '@angular/core';
import {TruthyPipe} from "./truthy.pipe";

@Pipe({
  name: 'falsy',
  pure: false,
  standalone: true
})
export class FalsyPipe extends TruthyPipe implements PipeTransform {

  protected override parseValue(x: unknown): boolean {
    return !x;
  }
}
