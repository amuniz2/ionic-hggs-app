import {Routes} from '@angular/router';
import {EditPantryItemLocationComponent} from '../shared-module/smart-components/edit-pantry-item-location/edit-pantry-item-location.component';

export const SharedRoutes: Routes = [
  {
    path: 'pantry-items/:id/pantry-item-location/:locationId',
    component: EditPantryItemLocationComponent
  }
];
