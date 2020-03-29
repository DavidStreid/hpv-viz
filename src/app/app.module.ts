import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HpvVizModule} from '../../projects/hpv-viz/src/lib/hpv-viz.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HpvVizModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
