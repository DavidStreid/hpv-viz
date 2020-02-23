import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {VcfInfoModel} from './VcfInfoModel.class';

@Component({
  selector:      'VcfFileViewer', // tslint:disable-line
  templateUrl:  './vcf-file-viewer.component.html',
  styleUrls:    ['./vcf-file-viewer.component.scss']
})
export class VcfFileViewerComponent implements OnChanges {
  @Input()
  public vcfFileInfo: Object[];

  public vcfFileModels: VcfInfoModel[] = [];

  public selectedModel: VcfInfoModel;

  ngOnChanges(changes: SimpleChanges) {
    const fileUpdate = changes['vcfFileInfo'].currentValue;
    for(const update of fileUpdate){
      const model: VcfInfoModel = new VcfInfoModel(update);
      this.vcfFileModels.push(model);
      this.selectedModel = model;
    }
  }
}
