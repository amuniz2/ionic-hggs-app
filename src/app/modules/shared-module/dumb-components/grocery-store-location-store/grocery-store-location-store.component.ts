import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {ControlContainer, FormControl} from '@angular/forms';

export interface GroceryStoreSelected {
  id: number;
}

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
  selectedGroceryStoreChange: EventEmitter<GroceryStoreSelected> = new EventEmitter<GroceryStoreSelected>();
  selectedGroceryStoreId: number | null;
  selectGroceryStoreControl = new FormControl();

  constructor(public controlContainer: ControlContainer) {
  }

  ngOnInit() {
  }

  onChangeGroceryStoreSelected($event: CustomEvent) {
    this.selectedGroceryStoreChange.emit({ id: Number($event.detail.value) });
    // this.selectedGroceryStoreChange.emit({ id: $event.id });
  }
}
