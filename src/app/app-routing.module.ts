import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './home/home.page';
import {EditPantryItemLocationRequest} from "./modules/pantry-management/store/pantry-management.actions";
import {EditPantryItemLocationComponent} from "./modules/shared-module/smart-components/edit-pantry-item-location/edit-pantry-item-location.component";

export const routes: Routes = [
  // { path: 'manage-stores', component: StoreListComponent  },
  // { path: 'stores',
  //   loadChildren: './modules/store-management/store-management.module#StoreManagementModule'},
  // { path: 'pantry-items',
  //   loadChildren: './modules/pantry-management/pantry-management.module#PantryManagementModule'},
  { path: 'home',
    component: HomePageComponent,
    children: [
      // { path: 'grocery-stores',
      //   loadChildren: './modules/store-management/store-management.module#StoreManagementModule',
      // },
      { path: 'pantry-items',
        loadChildren: './modules/pantry-management/pantry-management.module#PantryManagementModule'
      },
      { path: 'shopping-list',
        loadChildren: './modules/shopping/shopping.module#ShoppingModule'
      },
    ]
  },
  {
    path: 'shared',
    loadChildren: './modules/shared-module/shared.module#SharedModule'
  },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  // { path: '', redirectTo: 'manage-stores', pathMatch: 'full'},
  // { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
 })
export class AppRoutingModule { }
