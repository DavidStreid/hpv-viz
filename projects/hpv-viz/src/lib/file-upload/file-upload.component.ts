import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { VcfParserService } from '../../../../vcf-parser/src/lib/vcf-parser.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output()
  public vcfUpload = new EventEmitter<Object>();

  currentUpload: Object;
  chromosomes: any = {};
  dropzoneActive: boolean = false;

  constructor(private vcfParserService: VcfParserService) { }

  ngOnInit() {}

  public dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  public handleDrop(fileList: FileList) {
    for( var i = 0; i<fileList.length; i++ ){
      this.readFile(fileList[i]);
    }
  }

  // The hpv variants are denoted by the label on the chromosome field of the vcf
  private getHpvTypes(file: string): Set<string> {
    return this.vcfParserService.extractChromosomes(file);
  }

  // 'P1_MOCK.ann.vcf' -> 'P1'
  private getPatientFromFileName(name: string): string {
    // TODO - constant file?
    const NAME_DELIMITER = '_';

    const splitName = name.split(NAME_DELIMITER);
    if( splitName.length > 1 ){
      return splitName[0];
    }

    return 'NO_NAME'
  }

  private formatForVisualization(patient: string, date: Date, hpvTypes: Set<string>){
    const name = patient;
    const series = [];

    hpvTypes.forEach( function(type) {
      const o1 = {
        name: date,
        y: type,
        x: date,
        r: 1
      }
      series.push(o1);
    });

    return { name, series };
  }

  private readFile(file: File) {
      const name = file['name'] || 'NO_NAME';
      const patient = this.getPatientFromFileName( name );
      var reader = new FileReader();

      reader.onload = () => {
        const hpvTypes = this.getHpvTypes(reader.result);
        const date = this.vcfParserService.extractDate(reader.result);
        const dataPoint = this.formatForVisualization( patient, date, hpvTypes );
        this.vcfUpload.emit( dataPoint );
      };
      var contents = reader.readAsText(file);
  }
}
