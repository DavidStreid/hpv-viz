import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TableModalComponent} from './table-modal.component';

describe('TableModalComponent', () => {
  let component: TableModalComponent;
  let fixture: ComponentFixture<TableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableModalComponent]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(TableModalComponent);
      component = fixture.componentInstance;
    });
  }));

  it('Clicking close should trigger event emission', () => {
    // Note - don't spy on the component onClick method becuase it will interfere w/ the emit spy
    spyOn(component.closeModal, 'emit');

    const button = fixture.debugElement.nativeElement.querySelector('i');
    button.click();

    expect(component.closeModal.emit).toHaveBeenCalledWith(true);
  });

});
