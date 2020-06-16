import {GroceryStore} from './grocery-store';
import {PantryItem} from './pantry-item';
import {PantryItemLocation} from './PantryItemLocation';
import {GroceryStoreLocation} from './grocery-store-location';
import {GroceryStoreAisle} from './grocery-store-aisle';
import {GroceryStoreSection} from './grocery-store-section';

export class HggsData {
  groceryStores: GroceryStore[];
  pantryItems: PantryItem[];
  groceryStoreAisles: GroceryStoreAisle[];
  groceryStoreSections: GroceryStoreSection[]
  pantryItemLocations: PantryItemLocation[];
  groceryStoreLocations: GroceryStoreLocation[];
}
