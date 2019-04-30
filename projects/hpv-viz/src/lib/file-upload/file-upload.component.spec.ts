import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';
import { TEST_FILES } from '../../../../tests/mock-data/vcf-files';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadComponent ]
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

    for( var e of events ){
      component.dropzoneState(e);
      expect(component.dropzoneActive).toEqual(e);
    }
  });

  it('On drop, vcfUpload emits correct event', (done) => {
    for( var fileName in TEST_FILES ) {
      const f = new File([""], "filename.txt");
      const contents = TEST_FILES[ fileName ]['contents'];
      const event = TEST_FILES[ fileName ]['event'];
      const blob = new Blob([contents], {type : 'application/json'});
      blob['name'] = fileName;
      const file = <File>blob;

      // Mocking FileList Ref - https://gist.github.com/amabes/88324d68690e0e7b8e313cd0cafaa219
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => file
      };

      component.vcfUpload.subscribe($event => {
        expect($event).toEqual(event);
        done();
      });
      component.handleDrop(fileList);
    }
  })
});
