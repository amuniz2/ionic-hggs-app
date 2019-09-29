import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HggsAccordionComponent } from './widgets/hggs-accordion/hggs-accordion.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [HggsAccordionComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [HggsAccordionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
