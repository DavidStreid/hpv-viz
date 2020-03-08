import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FileUploadComponent} from './file-upload.component';
import {TEST_FILES} from '../../test/mock-data/vcf-files';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Toggles dropzoneState correctly', () => {
    /**
     * These events should be emitted by the file-drop directive
     * EVENTS:
     *    true:   Should occur when the directive registers hovering files entering
     *    false:  Shoul occur when the directive registers hovering files leaving or user dropping files
     */
    const events = [true, false];

    for (const e of events) {
      component.dropzoneState(e);
      expect(component.dropzoneActive).toEqual(e);
    }
  });

  it('On drop, vcfUpload emits correct event', (done) => {
    for (const fileName in TEST_FILES) {
      if (TEST_FILES.hasOwnProperty(fileName)) {
        const f = new File([''], fileName);
        const contents = TEST_FILES[fileName]['contents'];
        const event = TEST_FILES[fileName]['event'];
        const blob = new Blob([contents], {type: 'application/json'});
        blob['name'] = fileName;
        const file = <File>blob;

        // Mocking FileList Ref - https://gist.github.com/amabes/88324d68690e0e7b8e313cd0cafaa219
        const fileList = {
          0: file,
          length: 1,
          item: (index: number) => file
        };

        // Subscribe to emitted event and test output
        component.vcfUpload.subscribe($event => {

          const strictTests = ['name', 'date'];
          const lazyTests = ['variantInfo'];

          for (const field of strictTests) {
            expect($event[field]).toEqual(event[field]);
          }
          for (const field of lazyTests) {
            expect(field in $event).toBeTruthy();
          }


          done();
        });
        component.handleDrop(fileList);
      }
    }
  });


  function checkFileName(fileName: string, expected: string, done:

  function

):
  void {
    const f = new File([''], fileName);
  const contents = '';
  const blob = new Blob([contents], {type: 'application/json'});
  blob['name'] = fileName;
  const file = <File>blob;

  const fileList = {
    0: file,
    length: 1,
    item: (index: number) => file
  };

  // Subscribe to emitted event and test output
  component.vcfUpload.subscribe($event => {
    expect($event.name).toEqual(expected);
    done();
  });
  component.handleDrop(fileList);
}

  // TODO - Wanted to do all name tests in same method - figure out async/await
  it('fileName is parsed from the file name correctly - P1.ann.vcf', (done) => {
    checkFileName('P1.ann.vcf', 'P1', done);
  });
  it('fileName is parsed from the file name correctly - P2_test.ann.vcf', (done) => {
    checkFileName('P2_test.ann.vcf', 'P2', done);
  });
});
