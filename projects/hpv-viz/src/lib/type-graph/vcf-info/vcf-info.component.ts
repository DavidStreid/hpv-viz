import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {VcfInfoModel} from './VcfInfoModel.class';

@Component({
  selector:      'VcfInfo', // tslint:disable-line
  templateUrl:  './vcf-info.component.html',
  styleUrls:    ['./vcf-info.component.scss']
})
export class VcfInfoComponent extends Component implements OnChanges {
  @Input()
  public vcfFileInfo: Object[];

  public vcfFileModels: VcfInfoModel[] = [];

  ngOnChanges(changes: SimpleChanges) {
    const fileUpdate = changes['vcfFileInfo'].currentValue;
    for(const update of fileUpdate){
      const model: VcfInfoModel = new VcfInfoModel(update);
      this.vcfFileModels.push(model);
    }
  }
}
