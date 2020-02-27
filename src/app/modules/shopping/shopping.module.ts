import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShoppingListComponent} from './smart-components/shopping-list/shopping-list.component';

@NgModule({
  declarations: [
    ShoppingListComponent
  ],
  providers: [],
  imports: [
    CommonModule
  ]
})
export class ShoppingModule { }
