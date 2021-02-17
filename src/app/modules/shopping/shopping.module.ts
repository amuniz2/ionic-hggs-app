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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddShoppingItemComponent} from './dumb-components/add-shopping-item/add-shopping-item.component';
import {EditShoppingItemDetailsComponent} from './dumb-components/edit-shopping-item-details/edit-shopping-item-details.component';
import {EditShoppingItemComponent} from './smart-components/edit-shopping-item/edit-shopping-item.component';
import {EditShoppingItemLocationComponent} from './smart-components/edit-shopping-item-location/edit-shopping-item-location.component';
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {File} from "@ionic-native/file/ngx";
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {GroceryDataExporter} from "../../services/grocery-data-exporter.service";
// import {PantryManagementModule} from "../pantry-management/pantry-management.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ShoppingRoutes),
        StoreModule.forFeature('shoppingListManagement', fromReducers.shoppingListManagementReducer),
        EffectsModule.forFeature([ShoppingListManagementEffects]),
        IonicModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
  declarations: [
    ShoppingListComponent,
    ShoppingItemListComponent,
    ShoppingItemComponent,
    AddShoppingItemComponent,
    EditShoppingItemComponent,
    EditShoppingItemDetailsComponent,
    EditShoppingItemLocationComponent
  ],
  providers: [
    SocialSharing,
    File,
    [{provide: 'IGroceryDataExporter', useClass: GroceryDataExporter}]
  ],
})
export class ShoppingModule { }
