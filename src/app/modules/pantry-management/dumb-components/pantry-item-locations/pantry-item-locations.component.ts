import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';

export interface NewItemLocationRequest {
  pantryItem: PantryItem;
}

@Component({
  selector: 'app-pantry-item-locations',
  templateUrl: './pantry-item-locations.component.html',
  styleUrls: ['./pantry-item-locations.component.scss']
})
export class PantryItemLocationsComponent implements OnInit {

  @Input()
  private pantryItem: PantryItem;

  @Input()
  private groceryLocations: GroceryStoreLocation[];

  constructor() { }

  @Output()
  notifyNewPantryItemLocationRequested: EventEmitter<NewItemLocationRequest> = new EventEmitter<NewItemLocationRequest>();

  ngOnInit() {
  }

  onAddPantryItemLocation() {
    this.notifyNewPantryItemLocationRequested.emit({ pantryItem: this.pantryItem });
  }
}
