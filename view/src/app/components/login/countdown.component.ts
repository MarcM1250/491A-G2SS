import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'countdown-app',
  template: `wait {{ timeleft | number: '2.2-2' }} seconds`,
})
export class CountdownComponent {
  
  @Input() timeleft: number;

  constructor() { 
      let x = setInterval( () => {
        this.timeleft = this.timeleft - 1;
        if (this.timeleft < 0) {
          clearInterval(x);
          this.timeleft = 0;
        }
  
      }, 1000); 

  }

}
