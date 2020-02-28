import {PantryItem} from '../../model/pantry-item';
import {LocationTable, PantryItemLocationTable, PantryItemTable, StoreTable} from './pantry-db-schema';
import {GroceryStore} from '../../model/grocery-store';
import {GroceryStoreLocation} from '../../model/grocery-store-location';
import {PantryItemLocation} from '../../model/PantryItemLocation';
import {Store} from '@ngrx/store';

export class DbRowConverters {
  public static rowToGroceryStore(row: any): GroceryStore {
    return {
      name: row[StoreTable.COLS.STORE_NAME],
      aisles: [],
      sections: [],
      id: row[StoreTable.COLS.ID],
      locations: []
    };
  }

  public static rowToPantryItem(row: any): PantryItem {
    // todo: read aisles, sections, and locations
    console.log('converting row to PantryItem:');
    console.log(row);
    return {
      name: row[PantryItemTable.COLS.NAME],
      description: row[PantryItemTable.COLS.DESCRIPTION],
      id: row[PantryItemTable.COLS.ID],
      locations: [],
      need: row[PantryItemTable.COLS.NEED],
      units: row[PantryItemTable.COLS.UNITS],
      defaultQuantity: row[PantryItemTable.COLS.DEFAULT_QUANTITY]
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
}
