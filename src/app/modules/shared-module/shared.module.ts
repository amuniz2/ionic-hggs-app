import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HggsAccordionComponent } from './widgets/hggs-accordion/hggs-accordion.component';
import {IonicModule} from '@ionic/angular';
import { SelectGroceryStoreComponent } from './dumb-components/select-grocery-store/select-grocery-store.component';
import { LocationComponent } from './dumb-components/location/location.component';
import { GroceryStoreLocationStoreComponent } from './dumb-components/grocery-store-location-store/grocery-store-location-store.component';
// tslint:disable-next-line:max-line-length
import { GroceryStoreLocationAisleOrSectionComponent } from './dumb-components/grocery-store-location/grocery-store-location-aisle-or-section.component';

@NgModule({
  declarations: [
    HggsAccordionComponent,
    SelectGroceryStoreComponent,
    LocationComponent,
    GroceryStoreLocationStoreComponent,
    GroceryStoreLocationAisleOrSectionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [HggsAccordionComponent, LocationComponent, GroceryStoreLocationStoreComponent, GroceryStoreLocationAisleOrSectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
