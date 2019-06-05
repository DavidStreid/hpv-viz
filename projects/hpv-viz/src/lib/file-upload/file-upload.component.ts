import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { VcfParserService } from '../../../../vcf-parser/src/lib/vcf-parser.service';
// import { VcfParserService } from 'vcf-parser';

@Component({
  selector: 'app-file-upload', // tslint:disable-line
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output()
  public vcfUpload = new EventEmitter<Object>();
  public dropzoneActive = false;

  constructor(private vcfParserService: VcfParserService) { }

  ngOnInit() {}

  public dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  public handleDrop(fileList: FileList) {
    for ( let i = 0; i < fileList.length; i++ ) {
      this.readFile(fileList[i]);
    }
  }

  /**
   * Returns a list of objects containing the column values of
   * each line of the vcf file
   *
   * @param file, string - string contents of vcf file
   */
  private getVariantInfo(file: string): Object[] {
    return this.vcfParserService.extractVariantInfo(file);
  }

  /**
   * 'P1_MOCK.ann.vcf' -> 'P1'
   *
   * @param name, string - file name
   */
  private getPatientFromFileName(name: string): string {
    // TODO - constant file?
    const NAME_DELIMITER = '_';

    const splitName = name.split(NAME_DELIMITER);
    if ( splitName.length > 1 ) {
      return splitName[0];
    }

    return 'NO_NAME';
  }

  private readFile(file: File) {
      const fileName = file['name'] || 'NO_NAME';
      // TODO - should change
      const name = this.getPatientFromFileName( fileName );
      const reader = new FileReader();

      reader.onload = () => {
        const variantInfo = this.getVariantInfo(reader.result);
        const date = this.vcfParserService.extractDate(reader.result);
        this.vcfUpload.emit( {name, date, variantInfo });
      };
      const contents = reader.readAsText(file);
  }
}
