import {Routes} from '@angular/router';
import {StoreInventoryManagerPageComponent} from './smart-components/store-inventory-manager/store-inventory-manager-page.component';
import {EditSelectedGroceryStoreComponent} from './smart-components/edit-selected-grocery-store/edit-selected-grocery-store.component';
import {GroceryStoreAislesComponent} from './dumb-components/grocery-store-aisles/grocery-store-aisles.component';

export const StoreManagementRoutes: Routes = [
  {
    path: 'manage',
    component: StoreInventoryManagerPageComponent
  },
  {
    path: 'manage/store-details',
    component: EditSelectedGroceryStoreComponent
  },
  {
    path: 'manage/store-details/edit-store',
    component: GroceryStoreAislesComponent
  }
];
