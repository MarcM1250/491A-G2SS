import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-countdown',
  template: `wait {{ timeleft | number: '1.1-1' }} seconds`,
})
export class CountdownComponent {

  @Input() timeleft: number;

  constructor() {
    const x = setInterval(() => {
      this.timeleft = this.timeleft - 0.1;
      if (this.timeleft < 0) {
        clearInterval(x);
        this.timeleft = 0;
      }
    }, 100);
  }
}
