import { Component, OnInit } from '@angular/core';
import { VcfParserService } from '../../../../vcf-parser/src/lib/vcf-parser.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  currentUpload: Object;
  dropzoneActive: boolean = false;

  chromosomes: any = {};

  constructor(private vcfParserService: VcfParserService) { }

  ngOnInit() {}

  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }

  handleDrop(fileList: FileList) {
    for( var i = 0; i<fileList.length; i++ ){
      this.readFile(fileList[i]);
    }

  }

  parseFile(file: string): void{
    return this.vcfParserService.extractChromosomes(file);
  }

  readFile(file: File) {
      const name = file['name'] || 'NO_NAME';
      var reader = new FileReader();
      reader.onload = () => {
        const chrSet = this.parseFile(reader.result);
        this.chromosomes[ name ] = chrSet;
      };
      var contents = reader.readAsText(file);
  }
}
