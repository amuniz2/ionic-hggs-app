import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';

@Component({
  selector: 'app-select-grocery-store',
  templateUrl: './select-grocery-store.component.html',
  styleUrls: ['./select-grocery-store.component.scss']
})
export class SelectGroceryStoreComponent implements OnInit {

  @Input()
  groceryStores: GroceryStore[];
  selectedGroceryStore: any;

  @Output()
  selectedGroceryStoreChange: EventEmitter<GroceryStore> = new EventEmitter<GroceryStore>();

  constructor() {
  }

  ngOnInit() {
  }

  onChangeGroceryStoreSelected($event: CustomEvent) {
    this.selectedGroceryStoreChange.emit($event.detail.value);
  }

  compareById(store1: GroceryStore, store2: GroceryStore) {
    return store1.id === store2.id;
  }
}
