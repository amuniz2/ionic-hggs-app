import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {UiCrudAction} from '../../../../ui-crud-actions';
import {GroceryStoreState} from '../../../../model/grocery-store';

export interface NewItemLocationRequest {
  pantryItem: PantryItem;
  action: UiCrudAction;
  existingLocations: GroceryStoreLocation[];
}

export interface EditItemLocationRequest {
  pantryItem: PantryItem;
  storeLocation: GroceryStoreLocation;
  action: UiCrudAction;
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

  @Input()
  private groceryStores: GroceryStoreState[];

  constructor() { }

  @Output()
  notifyNewPantryItemLocationRequested: EventEmitter<NewItemLocationRequest> = new EventEmitter<NewItemLocationRequest>();

  @Output()
  notifyEditPantryItemLocationRequested: EventEmitter<EditItemLocationRequest> = new EventEmitter<EditItemLocationRequest>();

  ngOnInit() {
  }

  getLocationDescription(loc: GroceryStoreLocation): string {
    let desc =  loc.storeName;
    if (loc.aisle) {
      desc +=  `, ${loc.aisle} Aisle`;
    }
    if (loc.section) {
      desc += `, ${loc.section} Section`;
    }
    return desc;
  }

  editLocation(loc: GroceryStoreLocation) {
    this.notifyEditPantryItemLocationRequested.emit( {
      pantryItem: this.pantryItem,
      storeLocation: loc,
      action: UiCrudAction.Update
    });
  }

  remove(loc: GroceryStoreLocation) {
    this.notifyEditPantryItemLocationRequested.emit( {
      pantryItem: this.pantryItem,
      storeLocation: loc,
      action: UiCrudAction.Delete
    });
  }
}
