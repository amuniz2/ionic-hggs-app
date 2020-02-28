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
import { EditPantryItemLocationComponent } from './smart-components/edit-pantry-item-location/edit-pantry-item-location.component';
import { AddPantryItemComponent } from './dumb-components/add-pantry-item/add-pantry-item.component';
import { ShoppingItemListComponent } from '../shopping/dumb-components/shopping-item-list/shopping-item-list.component';

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
    EditPantryItemLocationComponent,
    AddPantryItemComponent,
  ],
  providers: [
  ]
})

export class PantryManagementModule { }
