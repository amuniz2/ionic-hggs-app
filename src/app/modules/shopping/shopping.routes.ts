import {Routes} from '@angular/router';
import {ShoppingListComponent} from './smart-components/shopping-list/shopping-list.component';

export const ShoppingRoutes: Routes = [
  {
    path: ':storeId/shopping-list',
    component: ShoppingListComponent
  },
];
