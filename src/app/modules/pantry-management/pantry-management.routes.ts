import {Routes} from '@angular/router';
import {PantryInventoryManagerComponent} from './smart-components/pantry-inventory-manager/pantry-inventory-manager.component';
import {EditPantryItemComponent} from './smart-components/edit-pantry-item/edit-pantry-item.component';
import {AddPantryItemLocationComponent} from './smart-components/add-pantry-item-location/add-pantry-item-location.component';

export const PantryManagementRoutes: Routes = [
  {
    path: '',
    component: PantryInventoryManagerComponent
  },
  {
    path: ':id/new-pantry-item-location',
    component: AddPantryItemLocationComponent
  },
  {
    path: 'pantry-item-details',
    component: EditPantryItemComponent
  },
  {
    path: 'pantry-item-locations',
    component: AddPantryItemLocationComponent
  },
];
