import { TestBed, ComponentFixture }  from '@angular/core/testing';
import { Component, DebugElement }    from '@angular/core';
import { By }                         from '@angular/platform-browser';
import { FileDropDirective }          from './file-drop.directive';
@Component({
  template: `<div
                fileDrop
                (filesDropped)='handleDrop($event)'
                (filesHovered)='handleHover($event)'></div>`
})
class TestFileDropComponent {
  public handleDrop($event): void {}
  public handleHover($event): void {}
}

describe('Directive', () => {
  let component: TestFileDropComponent;
  let fixture: ComponentFixture<TestFileDropComponent>;
  let div: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestFileDropComponent, FileDropDirective ]
    });

    fixture = TestBed.createComponent(TestFileDropComponent);
    component = fixture.componentInstance;
    div = fixture.debugElement.query(By.css('div'));
  });

  it('filesHovered emits true on hover over', () => {
    spyOn(component, 'handleHover');

    const evt = new Event('dragOverEvent', {});
    div.triggerEventHandler('dragover', evt);

    expect(component.handleHover).toHaveBeenCalledWith(true);
  });

  it('filesHovered emits false on hover leave', () => {
    spyOn(component, 'handleHover');

    const evt = new Event('dragLeaveEvent', {});
    div.triggerEventHandler('dragleave', evt);

    expect(component.handleHover).toHaveBeenCalledWith(false);
  });

  it('On drop event, hover emits false and drop emits files', () => {
    spyOn(component, 'handleHover');
    spyOn(component, 'handleDrop');

    const files = 'MOCK';
    const evt: Event = new Event('dropEvent', {});
    evt[ 'dataTransfer' ] = { files } ;

    div.triggerEventHandler('drop', evt);

    expect(component.handleDrop).toHaveBeenCalledWith(files);
    expect(component.handleHover).toHaveBeenCalledWith(false);
  });
});
