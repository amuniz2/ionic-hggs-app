import {Routes} from '@angular/router';
import {ShoppingListComponent} from './smart-components/shopping-list/shopping-list.component';
import {EditShoppingItemComponent} from './smart-components/edit-shopping-item/edit-shopping-item.component';

export const ShoppingRoutes: Routes = [
  {
    path: '',
    component: ShoppingListComponent
  },
  {
    path: ':storeId/shopping-list',
    component: ShoppingListComponent
  },
  {
    path: 'shopping-item-details',
    component: EditShoppingItemComponent
  }
];
