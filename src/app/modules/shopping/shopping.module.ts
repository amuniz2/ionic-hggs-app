import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShoppingListComponent} from './smart-components/shopping-list/shopping-list.component';
import {RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {ShoppingRoutes} from './shopping.routes';
import {ShoppingListManagementEffects} from './store/shopping.effects';
import * as fromReducers from './store/shopping.reducers';
import {IonicModule} from '@ionic/angular';
import {SharedModule} from '../shared-module/shared.module';
import {ShoppingItemListComponent} from './dumb-components/shopping-item-list/shopping-item-list.component';
import { ShoppingItemComponent } from './dumb-components/shopping-item/shopping-item.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ShoppingRoutes),
    StoreModule.forFeature('shoppingListManagement', fromReducers.shoppingListManagementReducer),
    EffectsModule.forFeature([ShoppingListManagementEffects]),
    IonicModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    ShoppingListComponent,
    ShoppingItemListComponent,
    ShoppingItemComponent,
  ],
  providers: [],
})
export class ShoppingModule { }
