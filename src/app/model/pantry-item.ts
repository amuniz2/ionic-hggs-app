import {GroceryStoreLocation} from './grocery-store-location';


export class PantryItem {
  id: number;
  name: string;
  description: string;
  locations: GroceryStoreLocation[];
  need: boolean;
  quantityNeeded: number;
  units: string;
  defaultQuantity: number;
  inCart: boolean;
  selectByDefault: boolean;

  constructor() {
    this.id = 0;
    this.locations = [];
    this.description = '';
    this.name = '';
    this.need = true;
    this.defaultQuantity = 1;
    this.units = '';
    this.quantityNeeded = 1;
    this.inCart = false;
    this.selectByDefault = false;
  }
}
