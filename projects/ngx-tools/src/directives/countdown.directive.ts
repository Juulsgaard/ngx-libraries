import {Directive, ElementRef, inject, Input, LOCALE_ID, NgZone, OnChanges, SimpleChanges} from '@angular/core';
import {objToArr, sortNumDesc} from "@juulsgaard/ts-tools";
import {concat, EMPTY, endWith, fromEvent, interval, share, startWith, Subscription, takeWhile, timer} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {Dispose} from "../decorators";
import {formatDate} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

@Directive({selector: '[countdown]', standalone: true, host: {'[class.ngx-countdown]': 'true'}})
export class CountdownDirective implements OnChanges {

  countdownConfig: CountdownConfig = defaultCountdownConfig
  @Input({alias: 'countdownConfig'}) set options(options: CountdownOptions) {
    this.countdownConfig = {...defaultCountdownConfig, ...options};
  };

  @Input({required: true}) set countdown(date: Date | string | number) {
    this.endTime = new Date(date);
  };

  endTime!: Date;

  @Dispose timeSub?: Subscription;

  private element = inject(ElementRef<HTMLElement>).nativeElement;
  private locale = inject(LOCALE_ID);

  styleIndex = -1;
  dateFormatThreshold = DAY;
  timeFormatThreshold = HOUR;
  styleThresholds: { threshold: number, classes: string[] }[] = [];

  constructor(private zone: NgZone) {
    this.applyConfig();

    zone.runOutsideAngular(
      () => fromEvent(document, 'visibilitychange').pipe(
        map(() => !document.hidden),
        distinctUntilChanged(),
        takeUntilDestroyed()
      ).subscribe(x => this.visibilityChanged(x))
    );
  }

  private visibilityChanged(visible: boolean) {
    if (visible) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  //<editor-fold desc="Updates">
  ngOnChanges(changes: SimpleChanges) {

    if ('countdownConfig' in changes) {
      this.applyConfig();
    }

    if (document.hidden) return;
    this.zone.runOutsideAngular(() => this.startTimer());
  }

  private startTimer() {
    this.timeSub?.unsubscribe();
    this.styleIndex = -1;
    this.resetClasses();

    const delta = Math.floor((
      this.endTime.getTime() - Date.now()
    ) / 1000);

    if (delta <= 0) {
      this.render(0);
      return;
    }

    const dateDelta = delta - this.dateFormatThreshold;
    const dateDelay = dateDelta > 0 ? timer(Math.max(0, dateDelta + 1)) : EMPTY;

    const maxTimeDelay = Math.max(0, this.dateFormatThreshold - this.timeFormatThreshold - 1);
    const timeDelta = Math.min(delta - this.timeFormatThreshold, maxTimeDelay);
    const timeDelay = timeDelta > 0 ? timer(timeDelta) : EMPTY;

    const time$ = concat(dateDelay, timeDelay, interval(500)).pipe(
      startWith(undefined),
      map(() => this.endTime.getTime() - Date.now()),
      takeWhile(x => x > 0),
      map(x => Math.floor(x / 1000)),
      endWith(0),
      distinctUntilChanged(),
      share()
    );

    this.timeSub = time$.subscribe(time => this.render(time));
  }

  private stopTimer() {
    this.timeSub?.unsubscribe();
  }

  private applyConfig() {
    this.dateFormatThreshold = parseTime(this.countdownConfig.dateFormatThreshold);
    this.timeFormatThreshold = parseTime(this.countdownConfig.timeFormatThreshold);
    this.styleThresholds = objToArr(
      this.countdownConfig.styleThresholds,
      (val, key) => (
        {
          threshold: parseTime(key),
          classes: Array.isArray(val) ? val : [val]
        }
      )
    );
    this.styleThresholds.sort(sortNumDesc(x => x.threshold));
  }

  //</editor-fold>

  //<editor-fold desc="Rendering">
  private render(time: number) {
    if (time > this.dateFormatThreshold) {
      return this.renderDate();
    }

    if (time > this.timeFormatThreshold) {
      return this.renderTime();
    }

    this.applyClasses(time);
    this.renderCountdown(this.formatTime(time));
  }

  private formatTime(time: number): [string | undefined, string | undefined, string] {
    const padding = this.countdownConfig.padNumbers ? 2 : 1;
    let output = new Array(3);

    if (time >= HOUR) {
      output[0] = Math.floor(time / HOUR).toString().padStart(padding, '0');
      time = time % HOUR
    } else {
      output[0] = undefined;
    }

    if (time >= MINUTE || output[0] !== undefined) {
      output[1] = Math.floor(time / MINUTE).toString().padStart(padding, '0');
      time = time % MINUTE;
    } else {
      output[1] = undefined;
    }

    output[2] = Math.floor(time).toString().padStart(padding, '0');

    return output as [string | undefined, string | undefined, string];
  }

  private renderDate() {
    this.element.innerText = formatDate(this.endTime, 'short', this.locale);
  }

  private renderTime() {
    this.element.innerText = formatDate(this.endTime, 'shortTime', this.locale);
  }

  appliedClasses?: string[];

  private resetClasses() {
    if (!this.appliedClasses) return;
    this.element.classList.remove(...this.appliedClasses);
  }

  private applyClasses(time: number) {
    if (!this.styleThresholds.length) return;

    if (this.styleIndex >= this.styleThresholds.length) {
      this.styleIndex = this.styleThresholds.length - 2;
    }

    let classes: string[] | undefined = undefined;

    for (let i = this.styleIndex + 1; i < this.styleThresholds.length; i++) {
      const item = this.styleThresholds[i]!;
      if (time > item.threshold) break;
      this.styleIndex = i;
      classes = item.classes;
    }

    if (!classes) return;

    this.resetClasses();
    this.element.classList.add(...this.styleThresholds[this.styleIndex]!.classes);
    this.appliedClasses = this.styleThresholds[this.styleIndex]!.classes;
  }

  private getText(hours: string|undefined, minutes: string|undefined, seconds: string) {
    const empty = this.countdownConfig.padNumbers ? '00' : '0';

    switch (this.countdownConfig.display) {
      case "default":
        return `${hours ? `${hours}:` : ''}${minutes ?? empty}:${seconds}`
      case "dynamic":
        return `${hours ? `${hours}:` : ''}${minutes ? `${minutes}:` : ''}:${seconds}`
      case "hours":
        return `${hours ?? empty}:${minutes ?? empty}:${seconds}`
      case "minutes":
        return `${minutes ?? empty}:${seconds}`
      case "seconds":
        return seconds;
    }
  }

  private renderCountdown([hours, minutes, seconds]: [string | undefined, string | undefined, string]) {
    this.element.innerText = this.getText(hours, minutes, seconds);
  }

  //</editor-fold>
}

function parseTime(input: string | number) {
  if (typeof input === 'number') return input;

  let segments = input.split(':');
  if (segments.length > 3) segments = segments.slice(-3);

  let time = 0;

  for (let i = 0; i < segments.length; i++) {
    let number = Number(segments[i]);
    if (Number.isNaN(number)) number = 0;
    const weight = Math.pow(MINUTE, segments.length - i - 1);
    time += weight * number;
  }

  return time;
}

export type CountdownOptions = Partial<CountdownConfig>;

export interface CountdownConfig {
  dateFormatThreshold: string | number;
  timeFormatThreshold: string | number;
  styleThresholds: Record<string | number, string | string[]>;
  display: 'default'|'dynamic'|'hours'|'minutes'|'seconds';
  padNumbers: boolean;
}

export const defaultCountdownConfig: CountdownConfig = {
  dateFormatThreshold: DAY,
  timeFormatThreshold: HOUR,
  styleThresholds: {
    '0:10': 'critical',
    '1:00': 'close',
    '2:00': 'low',
    '10:00': 'medium',
  },
  display: 'default',
  padNumbers: true
}
