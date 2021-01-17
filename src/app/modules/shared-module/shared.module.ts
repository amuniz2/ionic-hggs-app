import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HggsAccordionComponent } from './widgets/hggs-accordion/hggs-accordion.component';
import {IonicModule} from '@ionic/angular';
import { SelectGroceryStoreComponent } from './dumb-components/select-grocery-store/select-grocery-store.component';
import { GroceryStoreLocationStoreComponent } from './dumb-components/grocery-store-location-store/grocery-store-location-store.component';
// tslint:disable-next-line:max-line-length
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AddGroceryStoreModalComponent } from './add-grocery-store-modal/add-grocery-store-modal.component';
import {IonicSelectableModule} from 'ionic-selectable';
import {GroceryStoreLocationAisleOrSectionComponent} from './dumb-components/grocery-store-location-aisle-or-section/grocery-store-location-aisle-or-section.component';
import {RouterModule} from "@angular/router";
import {SharedRoutes} from "./shared.routes";
import {EditPantryItemLocationComponent} from "./smart-components/edit-pantry-item-location/edit-pantry-item-location.component";

@NgModule({
  declarations: [
    HggsAccordionComponent,
    SelectGroceryStoreComponent,
    GroceryStoreLocationStoreComponent,
    GroceryStoreLocationAisleOrSectionComponent,
    AddGroceryStoreModalComponent,
    EditPantryItemLocationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    RouterModule.forChild(SharedRoutes)
  ],
  exports: [
    HggsAccordionComponent,
    GroceryStoreLocationStoreComponent,
    GroceryStoreLocationAisleOrSectionComponent,
    SelectGroceryStoreComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
