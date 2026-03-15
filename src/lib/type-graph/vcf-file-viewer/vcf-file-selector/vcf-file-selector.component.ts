import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {VcfInfoModel} from '../VcfInfoModel.class';
import {SAMPLE_NAME} from '../../../common/app.const';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'VcfFileSelector',
  templateUrl: 'vcf-file-selector.component.html',
  styleUrls: ['vcf-file-selector.component.scss']
})
export class VcfFileSelectorComponent implements OnChanges {
  @Input()
  vcfInfoModel: VcfInfoModel;
  @Input()
  isSelected: boolean;

  sampleName: string;
  date: string;

  ngOnChanges(changes: SimpleChanges): void {
    const infoModel = changes['vcfInfoModel'];
    if (infoModel) {
      const modelUpdate = infoModel.currentValue;
      this.getSampleName(modelUpdate);
    }
  }

  private getSampleName(vcfModel: VcfInfoModel) {
    this.sampleName = vcfModel.getMetaData()[SAMPLE_NAME];
    const date = vcfModel.getSampleDate() || vcfModel.getFileCreationDate();
    this.date = `${date.getMonth() + 1}/${date.getDay()}/${date.getFullYear()}`;
  }
}
