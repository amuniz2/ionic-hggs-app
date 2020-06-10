import {GroceryStore} from './grocery-store';
import {PantryItem} from './pantry-item';
import {PantryItemLocation} from './PantryItemLocation';
import {GroceryStoreLocation} from './grocery-store-location';

export class HggsData {
  groceryStores: GroceryStore[];
  pantryItems: PantryItem[];
  pantryItemLocations: PantryItemLocation[];
  groceryStoreLocations: GroceryStoreLocation[];
}
