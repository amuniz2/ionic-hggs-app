import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import * as fromReducers from './store/pantry-management.reducers';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared-module/shared.module';
import {PantryManagementRoutes} from './pantry-management.routes';
import {PantryEffects} from './store/pantry-management.effects';
import { PantryInventoryManagerComponent } from './smart-components/pantry-inventory-manager/pantry-inventory-manager.component';
import { PantryItemListComponent } from './dumb-components/pantry-item-list/pantry-item-list.component';
import {EditPantryItemComponent} from './smart-components/edit-pantry-item/edit-pantry-item.component';
import { EditPantryItemDetailsComponent } from './dumb-components/edit-pantry-item-details/edit-pantry-item-details.component';
import { PantryItemLocationsComponent } from './dumb-components/pantry-item-locations/pantry-item-locations.component';
import { AddPantryItemLocationComponent } from './smart-components/add-pantry-item-location/add-pantry-item-location.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PantryManagementRoutes),
    StoreModule.forFeature('pantryManagement', fromReducers.pantryReducer),
    EffectsModule.forFeature([PantryEffects]),
    IonicModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PantryInventoryManagerComponent,
    PantryItemListComponent,
    EditPantryItemComponent,
    EditPantryItemDetailsComponent,
    PantryItemLocationsComponent,
    AddPantryItemLocationComponent
  ],
  providers: [
  ]
})

export class PantryManagementModule { }
