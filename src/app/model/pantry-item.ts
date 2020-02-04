import {GroceryStoreLocation} from './grocery-store-location';
import {PantryItemLocation} from './PantryItemLocation';

export interface PantryItem {
  id: number;
  name: string;
  description: string;
  locations: number[];
}
