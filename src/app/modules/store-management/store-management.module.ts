import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StoreInventoryManagerPageComponent} from './smart-components/store-inventory-manager/store-inventory-manager-page.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreListComponent} from './dumb-components/store-list/store-list.component';
import {StoreManagementEffects} from './store/store-management.effects';
import * as fromReducers from './store/store-management.reducers';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {StoreManagementRoutes} from './store-management.routes';
import {FormsModule} from '@angular/forms';
import { EditSelectedGroceryStoreComponent } from './smart-components/edit-selected-grocery-store/edit-selected-grocery-store.component';
import { GroceryStoreAislesComponent } from './dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import { GroceryStoreSectionsComponent } from './grocery-store-sections/grocery-store-sections.component';
import { GroceryStoreItemsComponent } from './grocery-store-items/grocery-store-items.component';
import { EditGroceryStoreComponent } from './dumb-components/edit-grocery-store/edit-grocery-store.component';
import {AddGrocreyStoreComponent} from './dumb-components/add-grocery-store/add-grocery-store';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(StoreManagementRoutes),
    StoreModule.forFeature('storeManagement', fromReducers.groceryStoresReducer),
    EffectsModule.forFeature([StoreManagementEffects]),
    IonicModule,
    FormsModule
  ],
  declarations: [
    StoreInventoryManagerPageComponent,
    StoreListComponent,
    EditSelectedGroceryStoreComponent,
    GroceryStoreAislesComponent,
    GroceryStoreSectionsComponent,
    GroceryStoreItemsComponent,
    EditGroceryStoreComponent,
    AddGrocreyStoreComponent
  ],
  providers: [
    // FakePantryDataService
  ]
})

export class StoreManagementModule { }
