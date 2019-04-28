import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }                               from '@angular/platform-browser';
import { SelectBoxComponent }               from './select-box.component';
import { DebugElement }    from '@angular/core';

describe('SelectBoxComponent', () => {
  let component: SelectBoxComponent;
  let fixture: ComponentFixture<SelectBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On Changes triggers internal & external state to toggle', () => {
    var notSelectedClass: DebugElement = fixture.debugElement.query(By.css('.fa-square-o'));
    var selectedClass: DebugElement = fixture.debugElement.query(By.css('.fa-check-square-o'));
    expect( notSelectedClass ).not.toBeNull();
    expect( selectedClass ).toBeNull();
    const firstChange = {
                          selected: {
                            currentValue: true,
                            firstChange:  true
                          }
                        };
    fixture.detectChanges();
    notSelectedClass = fixture.debugElement.query(By.css('.fa-square-o'));
    selectedClass = fixture.debugElement.query(By.css('.fa-check-square-o'));
    expect( notSelectedClass ).not.toBeNull();
    expect( selectedClass ).toBeNull();

    const userChange = {
                          selected: {
                            currentValue: true,
                            firstChange:  false
                          }
                        };
    component.ngOnChanges(userChange);
    fixture.detectChanges();
    notSelectedClass = fixture.debugElement.query(By.css('.fa-square-o'));
    selectedClass = fixture.debugElement.query(By.css('.fa-check-square-o'));
    expect( notSelectedClass ).toBeNull();
    expect( selectedClass ).not.toBeNull();
  });
});
