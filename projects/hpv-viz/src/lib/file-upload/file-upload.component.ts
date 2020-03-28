import {Component, EventEmitter, OnInit, Output} from '@angular/core';
// Note - use "ng build vcf-parser --watch"
import * as vcfParserService from 'variant-call-format-parser';
import DateParserUtil from '../utils/date-parser.util';
import {SAMPLE_DATE, SAMPLE_NAME} from '../common/app.const';

@Component({
  selector: 'app-file-upload', // tslint:disable-line
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output()
  public vcfUpload = new EventEmitter<Object>();
  public dropzoneActive = false;
  private dateParserUtil: DateParserUtil;

  constructor() {
  }

  ngOnInit() {
    this.dateParserUtil = new DateParserUtil();
  }

  public dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  public handleDrop(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
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
    return vcfParserService.extractVariantInfo(file);
  }

  private getMetadata(file: string): Object {
    return vcfParserService.extractMetadata(file);
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

    for (const delimiter of DELIMITERS) {
      const splitName = name.split(delimiter);
      if (splitName.length > 1) {
        return splitName[0];
      }
    }

    return 'NO_NAME';
  }

  private readFile(file: File) {
    const fileName = file['name'] || 'NO_NAME';
    const name = this.getPatientFromFileName(fileName);

    // Check name for whether a valid date can be parsed
    const tempDate = this.dateParserUtil.getDateFromFileName(fileName);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const variantInfo = this.getVariantInfo(result);

      const metaData: Object = this.getMetadata(result);
      metaData[SAMPLE_NAME] = name;

      // Use the name from the date if available, if not, grab from the time in the file
      if (tempDate !== null) {
        metaData[SAMPLE_DATE] = tempDate;
        this.vcfUpload.emit({name, date: tempDate, variantInfo, metaData});
      } else {
        const date = vcfParserService.extractDate(reader.result);
        this.vcfUpload.emit({name, date, variantInfo, metaData});
      }

    };
    const contents = reader.readAsText(file);
  }
}
