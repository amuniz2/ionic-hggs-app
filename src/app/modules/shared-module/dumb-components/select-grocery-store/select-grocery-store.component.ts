import {Component, Input, OnInit} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';

@Component({
  selector: 'app-select-grocery-store',
  templateUrl: './select-grocery-store.component.html',
  styleUrls: ['./select-grocery-store.component.scss']
})
export class SelectGroceryStoreComponent implements OnInit {

  @Input()
  groceryStores: GroceryStore[];

  constructor() { }

  ngOnInit() {
  }

}
