import { Component, EventEmitter, Output, OnInit } from '@angular/core';
// Note - use "ng build vcf-parser --watch"
import { VcfParserService } from 'vcf-parser';

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
   * Cycles through list of delimiters and attempts to extract a file name
   * 'P1_MOCK.ann.vcf'  -> 'P1'
   * 'P1.ann.vcf'       -> 'P1'
   *
   * @param name, string - file name
   */
  private getPatientFromFileName(name: string): string {
    const DELIMITERS: string[] = ['_', '.'];

    for( const delimiter of DELIMITERS ){
      const splitName = name.split(delimiter);
      if ( splitName.length > 1 ) {
        return splitName[0];
      }
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
