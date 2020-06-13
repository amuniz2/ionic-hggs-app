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

  @Input()
  groceryStoreIdsItemIsLocatedIn: number[];

  @Output()
  selectedGroceryStoreChange: EventEmitter<GroceryStore> = new EventEmitter<GroceryStore>();

  private possibleGroceryStores: GroceryStore[];
  constructor(public controlContainer: ControlContainer) {
  }

  ngOnInit() {
    if (this.selectedGroceryStore != null) {
      this.possibleGroceryStores = this.groceryStores.filter(groceryStore =>
        this.selectedGroceryStore.id === groceryStore.id || !this.groceryStoreIdsItemIsLocatedIn.some(id => id === groceryStore.id))
    } else {
      this.possibleGroceryStores = this.groceryStores.filter(groceryStore => !this.groceryStoreIdsItemIsLocatedIn.some(id => id === groceryStore.id));
    }
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
