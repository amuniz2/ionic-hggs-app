import {PantryItem} from '../../model/pantry-item';
import {LocationTable, PantryItemLocationTable, PantryItemTable, StoreTable} from './pantry-db-schema';
import {GroceryStore} from '../../model/grocery-store';
import {GroceryStoreLocation} from '../../model/grocery-store-location';
import {PantryItemLocation} from '../../model/PantryItemLocation';
import {ShoppingItem} from '../../model/shopping-item';

export class DbRowConverters {
  public static rowToGroceryStore(row: any): GroceryStore {
    return {
      name: row[StoreTable.COLS.STORE_NAME],
      aisles: new Set<string>(),
      sections: new Set<string>(),
      id: row[StoreTable.COLS.ID],
      locations: []
    };
  }

  public static rowToPantryItem(row: any): PantryItem {
    // todo: read aisles, sections, and locations
    const defaultQuantity =  row[PantryItemTable.COLS.DEFAULT_QUANTITY];
    const quantityNeeded =  row[PantryItemTable.COLS.QUANTITY_NEEDED];
    return {
      name: row[PantryItemTable.COLS.NAME],
      description: row[PantryItemTable.COLS.DESCRIPTION],
      id: row[PantryItemTable.COLS.ID],
      locations: [],
      need: row[PantryItemTable.COLS.NEED],
      units: row[PantryItemTable.COLS.UNITS],
      defaultQuantity,
      quantityNeeded: quantityNeeded === null ? defaultQuantity : quantityNeeded,
      inCart: row[PantryItemTable.COLS.IN_CART],
    };
  }

  public static rowToGroceryStoreLocation(row: any): GroceryStoreLocation {
    return {
      storeId: row[LocationTable.COLS.STORE_ID],
      storeName: row[StoreTable.COLS.STORE_NAME],
      section: row[LocationTable.COLS.SECTION_NAME],
      aisle: row[LocationTable.COLS.AISLE],
      id: row[LocationTable.COLS.ID],
    };
  }

  public static rowToPantryItemLocation(row: any): PantryItemLocation {
    return {
      pantryItemId: row[PantryItemLocationTable.COLS.PANTRY_ITEM_ID],
      groceryStoreLocationId: row[PantryItemLocationTable.COLS.LOCATION_ID],
    };
  }

  public static rowToShoppingItem(row: any): ShoppingItem {
    return {
      name: row[PantryItemTable.COLS.NAME],
      description: row[PantryItemTable.COLS.DESCRIPTION],
      pantryItemId: row[PantryItemTable.COLS.ID],
      units: row[PantryItemTable.COLS.UNITS],
      quantity: row[PantryItemTable.COLS.QUANTITY_NEEDED],
      inCart: row[PantryItemTable.COLS.IN_CART],
      storeId: row[LocationTable.COLS.STORE_ID],
      location: {
        locationId: row[LocationTable.COLS.ID],
        aisle: row[LocationTable.COLS.AISLE],
        section: row[LocationTable.COLS.SECTION_NAME],
      }
    };
  }
  public static rowToString(row: any, columnName: string): string {
    return row[columnName];
  }
}
