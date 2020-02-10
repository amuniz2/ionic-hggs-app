import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {ControlContainer, FormControl} from '@angular/forms';

@Component({
  selector: 'app-grocery-store-location-store',
  templateUrl: './grocery-store-location-store.component.html',
  styleUrls: ['./grocery-store-location-store.component.scss']
})
export class GroceryStoreLocationStoreComponent implements OnInit {

  @Input()
  groceryStores: GroceryStore[];

  @Input()
  selectedGroceryStore: GroceryStore;

  @Output()
  selectedGroceryStoreChange: EventEmitter<GroceryStore> = new EventEmitter<GroceryStore>();

  constructor(public controlContainer: ControlContainer) {
  }

  ngOnInit() {
  }

  onChangeGroceryStoreSelected($event: CustomEvent) {
    // if ((this.selectedGroceryStore == null ) || ($event.detail.value.id !== this.selectedGroceryStore.id)) {
      this.selectedGroceryStoreChange.emit($event.detail.value);
    // }
    // this.selectedGroceryStoreChange.emit({ id: $event.id });
  }

  compareById(store1: GroceryStore, store2: GroceryStore) {
    return store1.id === store2.id;
  }
}
