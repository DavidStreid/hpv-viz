import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from './modal-message.class';
import {interval, Subject} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {MessageTypeEnum} from './message-type.enum';

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

  public status: string;          // Provides overall status of the loading
  public messages: Message[];     // Messages to show in the loader
  public close: Subject<any>;     // Subject that pushes events with each message
  private INTERVAL = 500;         // Time in milliseconds w/o a message update before the loader @doneLoading message
  private CLOSE_INTERVAL = 500;   // Time in milliseconds before the loader automatically closes
  public numFiles;                // Number of uploaded files

  constructor() {
    this.messages = [];
    this.doneLoading = new EventEmitter<void>();

    this.numFiles = 0;
    this.status = 'No samples loaded';

    this.close = new Subject<any>();
    const results = this.close.pipe(debounce(() => interval(this.INTERVAL)));
    results.subscribe(x => {
      this.status = `Uploaded ${this.numFiles} samples. Done.`;
      setTimeout(() => {
        this.doneLoading.emit();
      }, this.CLOSE_INTERVAL);
    });
  }

  /**
   * Updates view on input message
   * @param msg
   */
  private updateViewWithMessage(msg: Message): void {
    if(msg.isType(MessageTypeEnum.NEW_FILE)){
      // Update overall status and continue
      this.numFiles += 1;
      this.status = `Uploading ${this.numFiles} samples`;
    }
    this.messages.push(msg);
    this.close.next();
  }

  ngOnInit(){
    this.updater.subscribe(
      (msg) => {
        this.updateViewWithMessage(msg);
      },
      console.error,
      console.log
    );
  }
}
