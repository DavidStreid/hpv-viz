import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoaderComponent} from './loader.component';
import {Subject} from 'rxjs';
import {Message} from './modal-message.class';
import {MessageTypeEnum} from './message-type.enum';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let updater: Subject<Message>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    updater = new Subject<Message>();
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    component.updater = updater;
    fixture.detectChanges();
  });

  it('Subject passes message to component', () => {
    expect(component.messages.length).toBe(0);
    updater.next(new Message('TEST MESSAGE', MessageTypeEnum.INFO));
    expect(component.messages.length).toBe(1);
  });

  it('Loader component doesn NOT update number of files on INFO message, but does update messages', () => {
    expect(component.numFiles).toBe(0);
    updater.next(new Message('UPLOADING TEST FILE', MessageTypeEnum.NEW_FILE));
    expect(component.numFiles).toBe(1);
    updater.next(new Message('UPDATING FILE', MessageTypeEnum.INFO));
    expect(component.numFiles).toBe(1);
    expect(component.messages.length).toBe(2);
  });
});
