import {Component, Input, OnInit} from '@angular/core';
import {Message} from './modal-message.class';
import {MessageTypeEnum} from './message-type.enum';
import {fromEvent, interval, Observable, Subject} from 'rxjs';
import {debounce} from 'rxjs/operators';

@Component({
  selector: 'loader', // tslint:disable-line
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input()
  public updater: Subject<Message>;

  public title: string;
  public show: boolean;
  public messages: Message[];

  public close: Subject<any>;

  constructor() {
    this.title = 'Loading';
    this.messages = [];
    this.show = true;
  }

  updateMessages(msg: Message): void {
    this.show = true;
    this.messages.push(msg);


    this.close = new Subject<any>();
    const results = this.close.pipe(debounce(() => interval(1000)));
    results.subscribe(x => {
      this.show = false;
    });
  }

  ngOnInit(){
    this.updater.subscribe(
      (msg) => {
        this.updateMessages(msg);
        this.close.next('test');
      },
      console.error,
      console.log
    );
  }
}
