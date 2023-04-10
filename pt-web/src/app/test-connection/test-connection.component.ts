import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-test-connection',
  templateUrl: './test-connection.component.html',
  styleUrls: ['./test-connection.component.scss'],
})
export class TestConnectionComponent implements OnChanges {
  @Input()
  promise?: Promise<string>;
  state?: string;
  text?: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.state = 'pending';
    this.promise?.then(
      (value) => {
        this.state = 'resolved';
        this.text = value;
      },
      (reason) => {
        this.state = 'rejected';
        alert(reason);
        this.text = reason;
      }
    );
  }
}
