import {GroceryStoreLocation} from './grocery-store-location';

export interface GroceryStore {
  id: number;
  name: string;
  aisles: string[];
  sections: string[];
  locations: GroceryStoreLocation[];
}
