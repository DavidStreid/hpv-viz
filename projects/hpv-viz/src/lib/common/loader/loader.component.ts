import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from './modal-message.class';
import {interval, Subject} from 'rxjs';
import {debounce} from 'rxjs/operators';

@Component({
  selector: 'loader', // tslint:disable-line
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input()
  public updater: Subject<Message>;
  /**
   * @show - Parent component feeds this in so that the @updater gets initialized w/ the parent.
   *    i.e. If you attach <loader *ngIf="{LOADING_BOOLEAN}"...></loader>, @updater won't be passed in and
   *    transmit messages until LOADING_BOOLEAN === true
   */
  @Input()
  public show: boolean;
  @Output()
  public doneLoading: EventEmitter<void>;

  public title: string;

  public messages: Message[];     // Messages to show in the loader
  public close: Subject<any>;     // Subject that pushes events with each message
  private INTERVAL = 500;         // Time in milliseconds w/o a message update before the loader @doneLoading message

  constructor() {
    this.title = 'Loading';
    this.messages = [];
    this.doneLoading = new EventEmitter<void>();

    this.close = new Subject<any>();
    const results = this.close.pipe(debounce(() => interval(this.INTERVAL)));
    results.subscribe(x => {
      this.doneLoading.emit();
    });
  }

  ngOnInit(){
    this.updater.subscribe(
      (msg) => {
        this.messages.push(msg);
        this.close.next();
      },
      console.error,
      console.log
    );
  }
}
