import {RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import * as fromReducers from './store/pantry-management.reducers';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared-module/shared.module';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {File} from '@ionic-native/file/ngx';
import {PantryManagementRoutes} from './pantry-management.routes';
import {PantryEffects} from './store/pantry-management.effects';
import { PantryInventoryManagerComponent } from './smart-components/pantry-inventory-manager/pantry-inventory-manager.component';
import { PantryItemListComponent } from './dumb-components/pantry-item-list/pantry-item-list.component';
import {EditPantryItemComponent} from './smart-components/edit-pantry-item/edit-pantry-item.component';
import { EditPantryItemDetailsComponent } from './dumb-components/edit-pantry-item-details/edit-pantry-item-details.component';
import { PantryItemLocationsComponent } from './dumb-components/pantry-item-locations/pantry-item-locations.component';
import { EditPantryItemLocationComponent } from '../shared-module/smart-components/edit-pantry-item-location/edit-pantry-item-location.component';
import { AddPantryItemComponent } from './dumb-components/add-pantry-item/add-pantry-item.component';
import {NgModule} from '@angular/core';
import {GroceryDataExporter} from '../../services/grocery-data-exporter.service';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';

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
        AddPantryItemComponent,
    ],
  exports: [
    AddPantryItemComponent,
    EditPantryItemDetailsComponent
  ],
    providers: [
        SocialSharing,
        File,
        BarcodeScanner,
        [{provide: 'IGroceryDataExporter', useClass: GroceryDataExporter}],
    ]
})

export class PantryManagementModule { }
