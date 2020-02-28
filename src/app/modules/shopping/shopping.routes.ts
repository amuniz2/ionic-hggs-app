import {Routes} from '@angular/router';
import {ShoppingListComponent} from './smart-components/shopping-list/shopping-list.component';
import {PantryInventoryManagerComponent} from '../pantry-management/smart-components/pantry-inventory-manager/pantry-inventory-manager.component';

export const ShoppingRoutes: Routes = [
  {
    path: '',
    component: ShoppingListComponent
  },
  {
    path: ':storeId/shopping-list',
    component: ShoppingListComponent
  },
];
