import {NgModule} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
// COMPONENTS
import {HpvVizComponent} from './hpv-viz.component';
import {TypeGraphComponent} from './type-graph/type-graph.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {SelectBoxComponent} from './common/select-box/select-box.component';
import {TableModalComponent} from './common/modal/table-modal.component';
import {VcfFileViewerComponent} from './type-graph/vcf-file-viewer/vcf-file-viewer.component';
import {VcfInfoComponent} from './type-graph/vcf-file-viewer/vcf-info/vcf-info.component';
import {VcfFileSelectorComponent} from './type-graph/vcf-file-viewer/vcf-file-selector/vcf-file-selector.component';
import {TypeToggleComponent} from './type-graph/toggles/type-toggle/type-toggle.component';
// SERVICES
import {HpvDataService} from './services/hpv-data-service';
// DIRECTIVES
import {FileDropDirective} from './directives/file-drop.directive';

// LOCAL DEPENDENCIES - Remove when deployed
// const LOCAL_MODULES = [ BrowserAnimationsModule ];
const LOCAL_MODULES = [];

const CHILD_COMPONENTS = [
  TypeGraphComponent,
  FileUploadComponent,
  SelectBoxComponent,
  TableModalComponent,
  VcfFileViewerComponent,
  VcfInfoComponent,
  VcfFileSelectorComponent,
  TypeToggleComponent,
  TypeSummaryComponent
];
const SERVICES = [HpvDataService];

@NgModule({
  imports: [
    NgxChartsModule,
    LOCAL_MODULES
  ],
  declarations: [HpvVizComponent, FileDropDirective, CHILD_COMPONENTS],
  exports: [HpvVizComponent],
  providers: [SERVICES]
})
export class HpvVizModule {
}
