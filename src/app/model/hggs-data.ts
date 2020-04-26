import {GroceryStore} from './grocery-store';
import {PantryItem} from './pantry-item';
import {PantryItemLocation} from './PantryItemLocation';

export interface HggsData {
  groceryStores: GroceryStore[];
  pantryItems: PantryItem[];
  pantryItemLocations: PantryItemLocation[];
}
