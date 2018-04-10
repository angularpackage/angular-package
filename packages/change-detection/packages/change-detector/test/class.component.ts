// external
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Type, OnInit } from '@angular/core';
import { ApChangeDetectorAClass, ApChangeDetectorClass } from '../';
import { ApChangeDetector, ApChangeDetectionProperties } from '../../interface';

@Component({
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="firstname">
    {{firstname}}
    {{surname}}
    {{age}}
  </div>
  `
})
export class TestComponent {
  public changeDetector: ApChangeDetectorClass<TestComponent>;
  public firstname = 'Martin';
  public surname = 'Greg';
  public age = 27;

  set detection(detection: boolean) {
    this.changeDetector.detection = detection;
    this.changeDetector.setDetection(this);
  }
  get detection(): boolean {
    return this.changeDetector.detection;
  }

  set properties(properties: any) {
    this.changeDetector.properties = properties;
    this.changeDetector.setDetection(this);
  }
  get properties(): any {
    return this.changeDetector.properties;
  }

  constructor(public c: ChangeDetectorRef) {
    this.changeDetector = new ApChangeDetectorClass<TestComponent>(this) as ApChangeDetectorClass<TestComponent>;
  }
}
