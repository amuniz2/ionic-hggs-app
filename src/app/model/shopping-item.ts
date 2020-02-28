import {PantryItem} from './pantry-item';
import {GroceryStoreLocation} from './grocery-store-location';

export class ShoppingItem {
  pantryItemId: number;
  locationId: number;
  quantity: number;
  inCart: boolean;
  pantryItem: PantryItem;
  location: GroceryStoreLocation;

  constructor(pantryItemId: number, locationId: number) {
    this.pantryItemId = pantryItemId;
    this.locationId = locationId;
    this.inCart = false;
    this.quantity = 1;
    this.pantryItem = null;
    this.location = null;
  }
}
