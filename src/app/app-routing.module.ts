import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './home/home.page';

const routes: Routes = [
  // { path: 'manage-stores', component: StoreListComponent  },
  // { path: 'stores',
  //   loadChildren: './modules/store-management/store-management.module#StoreManagementModule'},
  // { path: 'pantry-items',
  //   loadChildren: './modules/pantry-management/pantry-management.module#PantryManagementModule'},
  { path: 'home',
    component: HomePageComponent,
    children: [
      { path: 'grocery-stores',
        loadChildren: './modules/store-management/store-management.module#StoreManagementModule',
      },
      { path: 'pantry-items',
        loadChildren: './modules/pantry-management/pantry-management.module#PantryManagementModule'
      },
      { path: 'shopping-list',
        loadChildren: './modules/shopping/shopping.module#ShoppingModule'
      },
    ]
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
