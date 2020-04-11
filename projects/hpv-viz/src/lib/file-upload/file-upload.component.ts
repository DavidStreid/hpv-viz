import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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

  /**
   * Returns the date, in order of priority -
   *    1) File name, E.g. "P_3161994.hpv.bam" -> Date(Wed Nov 28 1994 00:00:00 GMT-0500)
   *    2) VCF File Contents
   *    3) If either don't contain the date, will log an error and return the date of the current time
   *
   * @param result, File-upload contents
   * @param fileName
   */
  private getDate(result: any, fileName: string): Date {
    let date = this.dateParserUtil.getDateFromFileName(fileName) || vcfParserService.extractDate(result);
    if(!date){
      console.error(`Could not parse date from filename: ${fileName} or uploaded file. Using current date`);
      date = new Date();
    }
    return date;
  }

  /**
   * Reads uploaded file and creates VCF entry
   * @param file
   */
  private readFile(file: File) {
    const fileName = file['name'] || 'NO_NAME';
    const name = this.getPatientFromFileName(fileName);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const variantInfo = this.getVariantInfo(result);

      const metaData: Object = this.getMetadata(result);
      metaData[SAMPLE_NAME] = name;

      const date = this.getDate(result, fileName);
      metaData[SAMPLE_DATE] = date;
      this.vcfUpload.emit({name, date, variantInfo, metaData});
    };
    const contents = reader.readAsText(file);
  }
}
