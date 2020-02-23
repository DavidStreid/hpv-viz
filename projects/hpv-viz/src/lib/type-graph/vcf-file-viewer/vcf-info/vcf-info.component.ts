import {Component, Input} from '@angular/core';
import {VcfInfoModel} from '../VcfInfoModel.class';

@Component({
  selector:      'VcfInfo', // tslint:disable-line
  templateUrl:  './vcf-info.component.html',
  styleUrls:    ['./vcf-info.component.scss']
})
export class VcfInfoComponent {
  @Input()
  model: VcfInfoModel;
}
