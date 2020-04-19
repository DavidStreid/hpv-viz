import {Component, Input} from '@angular/core';
import {Toggle} from '../models/toggle.class';
@Component({
  selector: 'vcf-file-info', // tslint:disable-line
  templateUrl: 'vcf-file-info.component.html',
  styleUrls: ['vcf-file-info.component.scss']
})
export class VcfFileInfoComponent {
  @Input()
  public patientToggles: Map<string, Toggle>;     // patient -> Toggle (Toggles don't track anything
  @Input()
  public vcfFileMap: Map<string, Object[]>;       // Map of all the VCF files for a given patient - key: patient

  // TAB-TOGGLE CODE (copy-pasta: start)
  public show: boolean;
  public title: string = 'VCF File Information';
  public toggleShow(): void{
    this.show = !this.show;
  }
  // TAB-TOGGLE CODE (copy-pasta: end)
}
