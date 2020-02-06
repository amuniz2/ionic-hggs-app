import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';

export interface NewItemLocationRequest {
  pantryItem: PantryItem;
}

export interface EditItemLocationRequest {
  pantryItem: PantryItem;
  locationId: number;
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

  @Output()
  notifyEditPantryItemLocationRequested: EventEmitter<EditItemLocationRequest> = new EventEmitter<EditItemLocationRequest>();

  ngOnInit() {
  }

  onAddPantryItemLocation() {
    this.notifyNewPantryItemLocationRequested.emit({ pantryItem: this.pantryItem });
  }

  getLocationDescription(loc: GroceryStoreLocation): string {
    let desc =  loc.storeName;
    if (loc.aisle) {
      desc +=  `, Aisle ${loc.aisle}`;
    }
    if (loc.section) {
      desc += `, Section ${loc.section}`;
    }
    return desc;
  }

  editLocation(loc: GroceryStoreLocation) {
    this.notifyEditPantryItemLocationRequested.emit( { pantryItem: this.pantryItem, locationId: loc.id});
  }
}
