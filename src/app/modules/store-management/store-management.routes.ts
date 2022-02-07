import {Routes} from '@angular/router';
import {StoreInventoryManagerPageComponent} from './smart-components/store-inventory-manager/store-inventory-manager-page.component';
import {EditSelectedGroceryStoreComponent} from './smart-components/edit-selected-grocery-store/edit-selected-grocery-store.component';
import {PantryInventoryManagerComponent} from "../pantry-management/smart-components/pantry-inventory-manager/pantry-inventory-manager.component";

export const StoreManagementRoutes: Routes = [
  {
    path: '',
    component: StoreInventoryManagerPageComponent
  },
  {
    path: 'store-details',
    component: EditSelectedGroceryStoreComponent
  },
  // {
  //   path: 'manage/store-details/edit-store',
  //   component: GroceryStoreAislesComponent
  // }
];
