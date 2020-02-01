import { Injectable, Scope } from '@nestjs/common';
import { performance, PerformanceObserver } from 'perf_hooks';

@Injectable({ scope: Scope.TRANSIENT })
export class PerformanceService {
  name;
  observer;

  measures = [];

  constructor(name) {
    this.name = name;
    this.start();

    this.observer = new PerformanceObserver(list => {
      this.measures = list.getEntriesByName(this.name);
    });

    this.observer.observe({ entryTypes: ['measure'] });
  }

  start(): void {
    performance.mark(`${this.name}@start`);
  }

  measure(): number {
    performance.mark(`${this.name}@end`);
    performance.measure(this.name, `${this.name}@start`, `${this.name}@end`);

    performance.clearMarks(`${this.name}@start`);
    performance.clearMarks(`${this.name}@end`);

    this.observer.disconnect();

    const measured = this.measures.find(measure => measure.name === this.name) || {};
    return measured.duration || 0;
  }
}
