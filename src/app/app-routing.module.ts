import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './home/home.page';
import {EditPantryItemLocationRequest} from "./modules/pantry-management/store/pantry-management.actions";
import {EditPantryItemLocationComponent} from "./modules/shared-module/smart-components/edit-pantry-item-location/edit-pantry-item-location.component";

export const routes: Routes = [
  { path: 'home',
    component: HomePageComponent,
    children: [
      // { path: 'grocery-stores',
      //   loadChildren: './modules/store-management/store-management.module#StoreManagementModule',
      // },
      { 
        path: 'pantry-items',
//        loadChildren: () => import('./modules/pantry-management/pantry-management.module#PantryManagementModule').then(m => m.)}
        loadChildren: () => import('./modules/pantry-management/pantry-management.module').then(m => m.PantryManagementModule)
      },
      { 
        path: 'shopping-list',
        loadChildren: () => import('./modules/shopping/shopping.module').then(m => m.ShoppingModule)
      },
      { 
        path: 'stores',
        loadChildren: () => import('./modules/store-management/store-management.module').then(m => m.StoreManagementModule)
      },
    ]
  },
  {
    path: 'shared',
    loadChildren: () => import('./modules/shared-module/shared.module').then(m => m.SharedModule)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  // { path: '', redirectTo: 'manage-stores', pathMatch: 'full'},
  // { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
 })
export class AppRoutingModule { }
