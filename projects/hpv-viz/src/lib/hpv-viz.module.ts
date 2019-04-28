import { NgModule } from '@angular/core';
import { NgxChartsModule }       from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// COMPONENTS
import { HpvVizComponent } from './hpv-viz.component';
import { TypeGraphComponent } from './type-graph/type-graph.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SelectBoxComponent } from './common/select-box/select-box.component';

// SERVICES
import { HpvDataService } from './services/hpv-data-service';
import { VcfParserService } from '../../../vcf-parser/src/lib/vcf-parser.service';

// DIRECTIVES
import { FileDropDirective } from './directives/file-drop.directive';

const CHILD_COMPONENTS = [ TypeGraphComponent, FileUploadComponent, SelectBoxComponent ];
const SERVICES = [ HpvDataService, VcfParserService ];

@NgModule({
  imports: [
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  declarations: [ HpvVizComponent, FileDropDirective, CHILD_COMPONENTS ],
  exports: [HpvVizComponent],
  providers: [ SERVICES ]
})
export class HpvVizModule { }
