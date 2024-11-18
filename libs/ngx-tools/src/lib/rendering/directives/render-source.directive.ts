import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
import {RenderSource} from "../models/render-source";

@Directive({selector: '[ngxSource]', standalone: true})
export class RenderSourceDirective<T> implements RenderSource<T> {
  constructor(
    public readonly template: TemplateRef<T>,
    public readonly viewContainer: ViewContainerRef
  ) { }
}

