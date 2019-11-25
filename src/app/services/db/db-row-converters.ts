import {PantryItem} from '../../model/pantry-item';
import {PantryItemTable, StoreTable} from './pantry-db-schema';
import {GroceryStore} from '../../model/grocery-store';

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
      //   locations: []
    };
  }
}
