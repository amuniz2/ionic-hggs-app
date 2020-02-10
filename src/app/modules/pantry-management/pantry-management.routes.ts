import {Routes} from '@angular/router';
import {PantryInventoryManagerComponent} from './smart-components/pantry-inventory-manager/pantry-inventory-manager.component';
import {EditPantryItemComponent} from './smart-components/edit-pantry-item/edit-pantry-item.component';
import {EditPantryItemLocationComponent} from './smart-components/edit-pantry-item-location/edit-pantry-item-location.component';

export const PantryManagementRoutes: Routes = [
  {
    path: '',
    component: PantryInventoryManagerComponent
  },
  {
    path: ':id/new-pantry-item-location',
    component: EditPantryItemLocationComponent
  },
  {
    path: ':id/pantry-item-location/:locationId',
    component: EditPantryItemLocationComponent
  },
  {
    path: 'pantry-item-details',
    component: EditPantryItemComponent
  },
  {
    path: 'pantry-item-locations',
    component: EditPantryItemLocationComponent
  },
];
