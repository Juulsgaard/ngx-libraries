import {
  booleanAttribute, Directive, effect, ElementRef, inject, Injector, input, InputSignal, InputSignalWithTransform,
  OnDestroy, signal, Signal
} from "@angular/core";
import {TemplateRendering} from "../models/template-rendering";

@Directive()
export abstract class BaseRenderDirective<T extends object> implements OnDestroy {
  abstract template: Signal<TemplateRendering<T> | undefined>;
  abstract renderInside: Signal<boolean>;
  abstract context: Signal<T | undefined>;
  abstract autoDispose: Signal<boolean>;
  abstract filter: Signal<((node: Node) => boolean)|undefined>;

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private injector = inject(Injector);

  constructor() {
    effect(() => this.update());
  }

  ngOnDestroy() {
    if (this.autoDispose()) {
      this._template?.dispose();
      return;
    }

    this._template?.anchorRemoved(this.element);
  }

  _template?: TemplateRendering<T>;

  update() {
    const template = this.template();

    if (template == null) {
      this._template?.detach(this.element);
      this._template = undefined;
      return;
    }

    this._template = template;
    const inside = this.renderInside();
    const context = this.context();
    const filter = this.filter()

    if (inside) {
      template.attachInside(this.element, this.injector, context, filter);
    } else {
      template.attachAfter(this.element, this.injector, context, filter);
    }

    template.updateContext(context);
  }
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({selector: 'ngx-render', host: {'[style.display]': 'renderInside() ? "" : "hidden"'}, standalone: true})
export class RenderOutletDirective<T extends object> extends BaseRenderDirective<T> {

  readonly template: InputSignal<TemplateRendering<T> | undefined> = input<TemplateRendering<T>>();
  readonly renderInside: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly context: InputSignal<T | undefined> = input<T>();
  readonly autoDispose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});

  readonly filter: InputSignal<((node: Node) => boolean) | undefined> = input<(node: Node) => boolean>();
}

@Directive({selector: '[ngxRender]', standalone: true})
export class TemplateRenderDirective<T extends object> extends BaseRenderDirective<T> {

  readonly template: InputSignal<TemplateRendering<T> | undefined> = input<TemplateRendering<T>|undefined>(undefined, {alias: 'ngxRender'});
  readonly context: InputSignal<T | undefined> = input<T>();

  readonly autoDispose: InputSignalWithTransform<boolean, unknown> = input(false, {transform: booleanAttribute});
  readonly renderInside = signal(true);

  readonly filter: InputSignal<((node: Node) => boolean) | undefined> = input<(node: Node) => boolean>();
}
