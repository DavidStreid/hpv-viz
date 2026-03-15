import {NgModule} from '@angular/core';
import { ReactiveFormsModule }    from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HpvVizComponent} from './vcf-viz.component';
import { NgxChartsModule }      from '@swimlane/ngx-charts';

// COMPONENTS
import {TypeGraphComponent} from './type-graph/type-graph.component';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {SelectBoxComponent} from './common/select-box/select-box.component';
import {TableModalComponent} from './common/modal/table-modal.component';
import {VcfFileViewerComponent} from './type-graph/vcf-file-viewer/vcf-file-viewer.component';
import {VcfInfoComponent} from './type-graph/vcf-file-viewer/vcf-info/vcf-info.component';
import {VcfFileSelectorComponent} from './type-graph/vcf-file-viewer/vcf-file-selector/vcf-file-selector.component';
import {TypeToggleComponent} from './type-graph/toggles/type-toggle/type-toggle.component';
import {TypeSummaryComponent} from './type-graph/summary-view/type-summary.component';
import {AnalysisViewComponent} from './type-graph/analysis-view/analysis-view.component';
import {PersistenceViewComponent} from './type-graph/persistence-view/persistence-view.component';
import {LoaderComponent} from './common/loader/loader.component';
import {TabToggleComponent} from './common/tab-toggle/tab-toggle.component';
import {VcfFileInfoComponent} from './type-graph/vcf-file-info/vcf-file-info.component';

// SERVICES
import {DiagnosticSnpsService} from './services/diagnostic-snps-service';

// DIRECTIVES
import {FileDropDirective} from './directives/file-drop.directive';

const LOCAL_MODULES = [CommonModule, NgxChartsModule];
// LOCAL DEPENDENCIES - Remove when deployed
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// const LOCAL_MODULES = [ CommonModule,BrowserAnimationsModule ];


const CHILD_COMPONENTS = [
  TypeGraphComponent,
  FileUploadComponent,
  SelectBoxComponent,
  TableModalComponent,
  VcfFileViewerComponent,
  VcfInfoComponent,
  VcfFileSelectorComponent,
  TypeToggleComponent,
  TypeSummaryComponent,
  AnalysisViewComponent,
  PersistenceViewComponent,
  LoaderComponent,
  TabToggleComponent,
  VcfFileInfoComponent
];
const SERVICES = [DiagnosticSnpsService];

@NgModule({
  imports: [
    ReactiveFormsModule,
    LOCAL_MODULES
  ],
  declarations: [HpvVizComponent, FileDropDirective, CHILD_COMPONENTS],
  exports: [HpvVizComponent],
  providers: [SERVICES]
})
export class VcfVizModule {
}
