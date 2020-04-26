import {PantryItem} from '../../model/pantry-item';
import * as pantrySchema from './pantry-db-schema';
import {DbRowConverters} from './db-row-converters';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {LocationTable, PantryItemLocationTable, PantryItemTable} from './pantry-db-schema';
import {GroceryStore} from '../../model/grocery-store';
import {StoreGroceryAisleTable} from './pantry-db-schema';
import {StoreTable} from './pantry-db-schema';
import {StoreGrocerySectionTable} from './pantry-db-schema';
import {MySqlHelpers} from './my-sql-helpers';
import {Injectable} from '@angular/core';
import {GroceryStoreLocation} from '../../model/grocery-store-location';
import {PantryItemLocation} from '../../model/PantryItemLocation';

@Injectable()
export class MySqlCommands {
  private db: SQLiteObject;
  constructor(private sqlite: SQLite) {
    this.db = null;
  }
  // region db commands
  public async openOrCreateDb(): Promise<boolean> {
    if (this.db !== null) {
      console.log('returning true from openOrCreateDb');
      return true;
    }
    const openedDb = await this.sqlite.create({ name: 'hggs-app.db', location: 'default'});
    // it was successful
    console.log('sqlite.create succeeded');
    const success = await this.createOrOpenTables(openedDb);
    console.log('create or open tables completed successfully');
    this.db = openedDb;
    return success;
  }

  private async createOrOpenTables(openedDb: SQLiteObject): Promise<boolean> {
    const sectionColumnDefinitions =
      pantrySchema.StoreGrocerySectionTable.COLS.GROCERY_SECTION + ' TEXT NOT NULL, ' +
      pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID + ' INT, ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID,
        pantrySchema.StoreTable.NAME,
        pantrySchema.StoreTable.COLS.ID) + ' ' +
      MySqlHelpers.BuildUniqueConstraint(pantrySchema.StoreGrocerySectionTable.NAME,
        pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID,
        pantrySchema.StoreGrocerySectionTable.COLS.GROCERY_SECTION);

    const aisleColumnDefinitions =
      pantrySchema.StoreGroceryAisleTable.COLS.GROCERY_AISLE + ' TEXT NOT NULL, ' +
      pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID + ' INTEGER, ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID,
        pantrySchema.StoreTable.NAME,
        pantrySchema.StoreTable.COLS.ID) + ' ' +
      MySqlHelpers.BuildUniqueConstraint(pantrySchema.StoreGroceryAisleTable.NAME,
        pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID,
        pantrySchema.StoreGroceryAisleTable.COLS.GROCERY_AISLE);

    const locationColumnDefinitions =
      pantrySchema.LocationTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      pantrySchema.LocationTable.COLS.SECTION_NAME + ', ' +
      pantrySchema.LocationTable.COLS.STORE_ID + ' INTEGER, ' +
      pantrySchema.LocationTable.COLS.AISLE + ', ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        pantrySchema.LocationTable.COLS.STORE_ID,
        pantrySchema.StoreTable.NAME,
        pantrySchema.StoreTable.COLS.ID) + ' ' +
      MySqlHelpers.BuildUniqueConstraint(pantrySchema.LocationTable.NAME,
        pantrySchema.LocationTable.COLS.STORE_ID,
        pantrySchema.LocationTable.COLS.SECTION_NAME,
        pantrySchema.LocationTable.COLS.AISLE) ;

    const pantryItemLocationColumnDefinitions =
      pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID + ' INTEGER, ' +
      pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID + ' INTEGER, ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID,
        pantrySchema.PantryItemTable.NAME,
        pantrySchema.PantryItemTable.COLS.ID ) + ', ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID,
        pantrySchema.LocationTable.NAME,
        pantrySchema.LocationTable.COLS.ID);

    const shoppingItemColumnDefinitions =
      pantrySchema.PantryItemTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      pantrySchema.ShoppingItemTable.COLS.IN_CART + ' TINYINT, ' +
      pantrySchema.ShoppingItemTable.COLS.SELECTED + ' TINYINT, ' +
      pantrySchema.ShoppingItemTable.COLS.QUANTITY + ' REAL, ' +
      pantrySchema.ShoppingItemTable.COLS.UNITS + ' TEXT, ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(pantrySchema.ShoppingItemTable.COLS.PANTRY_ITEM_ID,
        pantrySchema.PantryItemTable.NAME, pantrySchema.PantryItemTable.COLS.ID ) + ', ' +
      MySqlHelpers.BuildUniqueConstraint(pantrySchema.ShoppingItemTable.NAME, pantrySchema.ShoppingItemTable.COLS.PANTRY_ITEM_ID);

    const storeColumnDefinitions =
      pantrySchema.StoreTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      pantrySchema.StoreTable.COLS.STORE_NAME + ' TEXT NOT NULL, ' +
      MySqlHelpers.BuildUniqueConstraint(pantrySchema.StoreTable.NAME, pantrySchema.StoreTable.COLS.STORE_NAME);

    const pantryItemColumnDefinitions =
      pantrySchema.PantryItemTable.COLS.DESCRIPTION + ' TEXT, ' +
      pantrySchema.PantryItemTable.COLS.SELECT_BY_DEFAULT + ' TINYINT, ' +
      pantrySchema.PantryItemTable.COLS.NEED + ' TINYINT, ' +
      pantrySchema.PantryItemTable.COLS.DEFAULT_QUANTITY + ' REAL, ' +
      pantrySchema.PantryItemTable.COLS.QUANTITY_NEEDED + ' REAL, ' +
      pantrySchema.PantryItemTable.COLS.UNITS + ' TEXT, ' +
      pantrySchema.PantryItemTable.COLS.NAME + ' TEXT NOT NULL, ' +
      pantrySchema.PantryItemTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      MySqlHelpers.BuildUniqueConstraint(pantrySchema.PantryItemTable.NAME, pantrySchema.PantryItemTable.COLS.NAME);

    // tslint:disable-next-line:max-line-length
    // console.log(`Creating table definitions ${storeColumnDefinitions}, ${pantryItemColumnDefinitions}, ${sectionColumnDefinitions}, ${aisleColumnDefinitions}`);
    console.log('Creating table definitions');
    await this.createTableIfNeeded(openedDb, pantrySchema.StoreTable.NAME, storeColumnDefinitions);
    await this.createTableIfNeeded(openedDb, pantrySchema.StoreGrocerySectionTable.NAME, sectionColumnDefinitions);
    await this.createTableIfNeeded(openedDb, pantrySchema.StoreGroceryAisleTable.NAME, aisleColumnDefinitions);
    await this.createTableIfNeeded(openedDb, pantrySchema.LocationTable.NAME, locationColumnDefinitions);
    await this.createTableIfNeeded(openedDb,
      PantryItemTable.NAME,
      pantryItemColumnDefinitions);

    await this.createTableIfNeeded(openedDb, pantrySchema.PantryItemLocationTable.NAME, pantryItemLocationColumnDefinitions);
    return true;
  }

  closeDb() {
    if (this.db != null) {
      this.db.close().then(() => {
        this.db = null;
      });
    }
  }

  private async createTableIfNeeded(openedDb: SQLiteObject, tableName: string, columnDefinitions: string): Promise<any> {
    return await openedDb.executeSql(`create table if not exists ${tableName} (${columnDefinitions})`, []);
  }
  // endregion
  // region PantryItem CRUD
  public async insertPantryItem(pantryItemName: string, description: string): Promise<number> {
    const insertSql = `INSERT INTO
     ${pantrySchema.PantryItemTable.NAME}
     (${pantrySchema.PantryItemTable.COLS.NAME}, ${pantrySchema.PantryItemTable.COLS.DESCRIPTION})
      VALUES(\'${pantryItemName}\', \'${description}\')`;
    console.log('executing: ' + insertSql);
    try {
      const data = await this.db.executeSql(insertSql, []);
      console.log(`returning ${data} from insertPantryItem`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting pantry item ${pantryItemName}`);
      console.log(err);
    }
  }

  public async queryPantryItems(): Promise<PantryItem[]> {
    const pantryItems: PantryItem[] = [];
    try {
      const data = await this.db.executeSql(`SELECT * FROM ${PantryItemTable.NAME}`, []);
      for (let i = 0; i < data.rows.length; i++) {
        pantryItems.push(DbRowConverters.rowToPantryItem(data.rows.item(i)));
      }
    } catch (err) {
      console.log('Error querying for pantry items');
      console.log(err);
    }
    console.log('returning from query');
    console.log(pantryItems);
    return pantryItems;
  }

  public async updatePantryItem(updatedPantryItem: PantryItem): Promise<boolean> {
    try {
      const sqlUpdate = `UPDATE ${pantrySchema.PantryItemTable.NAME} SET
       ${pantrySchema.PantryItemTable.COLS.NAME}=\'${updatedPantryItem.name}\'
       , ${pantrySchema.PantryItemTable.COLS.DESCRIPTION}=\'${updatedPantryItem.description}\'
        WHERE ${pantrySchema.PantryItemTable.COLS.ID} = \'${updatedPantryItem.id}\'`;
      console.log(`running sql update: ${sqlUpdate}`);
      const data = await this.db.executeSql(sqlUpdate, []);
      if (data.rows.length > 0) {
        console.log('pantry item updated in db');
        return true;
      } else {
        console.log('pantry item failed');
        return false;
      }
    } catch (err) {
      console.log('Error updating pantry item');
      console.log(err);
      return false;
    }
  }
  public async queryPantryItemByName(name: string): Promise<PantryItem> {
    try {
      const sqlQueryByName = `SELECT * from ${pantrySchema.PantryItemTable.NAME}
       WHERE ${pantrySchema.PantryItemTable.COLS.NAME} = \'${name}\'`;
      console.log(`running query: ${sqlQueryByName}`);
      const data = await this.db.executeSql(sqlQueryByName, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to pantryItem');
        return DbRowConverters.rowToPantryItem(data.rows.item(0));
      } else {
        console.log('no pantryItem returned for query pantryItem by name');
        return null;
      }
    } catch (err) {
      console.log('Error querying pantry item by name');
      console.log(err);
      return null;
    }
  }

  public async deletePantryItem(id: number): Promise<number> {
    const  deleteSql = `DELETE FROM ${pantrySchema.PantryItemTable.NAME} WHERE ${pantrySchema.PantryItemTable.COLS.ID} = ${id}`;
    try {
      const data = await this.db.executeSql(deleteSql, []);
      console.log(`returning ${data} from deletePantryItem`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting pantry item ${id}`);
      console.log(err);
    }
  }
  // endregion

  // region GroceryStoreLocation CRUD
  public async insertGroceryStoreLocation(storeId: number, aisle: string, section: string): Promise<number> {
    const insertSql = `INSERT INTO
     ${pantrySchema.LocationTable.NAME}
     (${pantrySchema.LocationTable.COLS.STORE_ID},
     ${pantrySchema.LocationTable.COLS.AISLE},
     ${pantrySchema.LocationTable.COLS.SECTION_NAME})
      VALUES(${storeId}, \'${aisle}\', \'${section}\')`;
    console.log('executing: ' + insertSql);
    try {
      const data = await this.db.executeSql(insertSql, []);
      console.log(`returning ${data} from insertGroceryStoreLocation`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store location  ${insertSql}`);
      console.log(err);
    }
  }

  public async queryGroceryStoreLocations(): Promise<Map<number, GroceryStoreLocation[]>> {
    const locations: Map<number, GroceryStoreLocation[]> = new Map<number, GroceryStoreLocation[]>();
    try {
      const data = await this.db.executeSql(`SELECT * FROM ${LocationTable.NAME}
      JOIN ${pantrySchema.StoreTable.NAME} on ${pantrySchema.StoreTable.COLS.ID}=${pantrySchema.LocationTable.COLS.STORE_ID}`, []);
      for (let i = 0; i < data.rows.length; i++) {
        const groceryStoreLocation = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(i));
        if (locations.has(groceryStoreLocation.id)) {
          locations[groceryStoreLocation.id].push(groceryStoreLocation);
        } else {
          locations.set(groceryStoreLocation.id, [groceryStoreLocation]);
        }
      }
    } catch (err) {
      console.log('Error querying for grocery storeLocations');
      console.log(err);
    }
    console.log('returning from query');
    console.log(locations);
    return locations;
  }

  public async updateGroceryStoreLocation(updatedGroceryStoreLocation: GroceryStoreLocation): Promise<boolean> {
    try {
      const sqlUpdate = `UPDATE ${pantrySchema.LocationTable.NAME} SET
       ${pantrySchema.LocationTable.COLS.STORE_ID}=\'${updatedGroceryStoreLocation.storeId}\'
       , ${pantrySchema.LocationTable.COLS.AISLE}=\'${updatedGroceryStoreLocation.aisle}\'
       , ${pantrySchema.LocationTable.COLS.SECTION_NAME}=\'${updatedGroceryStoreLocation.section}\'
        WHERE ${pantrySchema.LocationTable.COLS.ID} = ${updatedGroceryStoreLocation.id}`;
      console.log(`running sql update: ${sqlUpdate}`);
      const data = await this.db.executeSql(sqlUpdate, []);
      if (data.rows.length > 0) {
        console.log('grocery store location updated in db');
        return true;
      } else {
        console.log('grocery store location update failed');
        return false;
      }
    } catch (err) {
      console.log('Error updating grocery store location');
      console.log(err);
      return false;
    }
  }
  public async queryGroceryStoreLocation(storeId: number, aisle: string, section: string): Promise<GroceryStoreLocation> {
    try {
      const sqlQueryByName = `SELECT * from ${pantrySchema.LocationTable.NAME}
      JOIN ${pantrySchema.StoreTable.NAME} on ${pantrySchema.StoreTable.COLS.ID}=${pantrySchema.LocationTable.COLS.STORE_ID}
       WHERE ${pantrySchema.LocationTable.COLS.STORE_ID} = \'${name}\'
       AND ${pantrySchema.LocationTable.COLS.AISLE} = \'${aisle}\'
       AND ${pantrySchema.LocationTable.COLS.STORE_ID} = \'${section}\'`;
      console.log(`running query: ${sqlQueryByName}`);
      const data = await this.db.executeSql(sqlQueryByName, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to GroceryStoreLocation');
        return DbRowConverters.rowToGroceryStoreLocation(data.rows.item(0));
      } else {
        console.log('no grocery store location returned for query by storeId, aisle, section');
        return null;
      }
    } catch (err) {
      console.log('Error querying grocery store location');
      console.log(err);
      return null;
    }
  }
  public async queryGroceryStoreLocationById(id: number): Promise<GroceryStoreLocation> {
    try {
      const sqlQueryById = `SELECT * from ${pantrySchema.LocationTable.NAME}
      JOIN ${pantrySchema.StoreTable.NAME} ON ${pantrySchema.LocationTable.COLS.STORE_ID} = ${pantrySchema.StoreTable.COLS.ID}
       WHERE ${pantrySchema.LocationTable.COLS.STORE_ID} = ${id}`;
      console.log(`running query: ${sqlQueryById}`);
      const data = await this.db.executeSql(sqlQueryById, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to GroceryStoreLocation');
        return DbRowConverters.rowToGroceryStoreLocation(data.rows.item(0));
      } else {
        console.log('no grocery store location returned for query by id');
        return null;
      }
    } catch (err) {
      console.log('Error querying grocery store location by id');
      console.log(err);
      return null;
    }
  }
  public async queryPantryItem(id: number): Promise<PantryItem> {
      try {
        const sqlQueryById = `SELECT * from ${pantrySchema.PantryItemTable.NAME}
       WHERE ${pantrySchema.PantryItemTable.COLS.ID} = ${id}`;
        console.log(`running query: ${sqlQueryById}`);
        const data = await this.db.executeSql(sqlQueryById, []);
        if (data.rows.length > 0) {
          console.log('at least 1 row returned, converting first row to PantryItem');
          return DbRowConverters.rowToPantryItem(data.rows.item(0));
      } else {
        console.log('no pantryItem returned for query by id');
        return null;
      }
    } catch (err) {
      console.log('Error querying pantry item by id');
      console.log(err);
      return null;
    }
  }
  public async deleteGroceryStoreLocation(id: number): Promise<number> {
    const  deleteSql = `DELETE FROM ${pantrySchema.LocationTable.NAME} WHERE ${pantrySchema.LocationTable.COLS.ID} = ${id}`;
    try {
      const data = await this.db.executeSql(deleteSql, []);
      console.log(`returning ${data} from deleteGroceryStoreLocation`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting grocery store location ${id}`);
      console.log(err);
    }
  }
  // endregion
  // endregion
  // region GroceryStoreSection CRUD
  /*
   todo: combine aisle and section tables into single table with column denoting if it section or aisle
  */
  public async insertGroceryStoreSection(groceryStoreId: number, section: string): Promise<number> {
    const insertSql = `INSERT INTO
     ${pantrySchema.StoreGrocerySectionTable.NAME}
     (${pantrySchema.StoreGrocerySectionTable.COLS.GROCERY_SECTION}, ${pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID})
      VALUES(\'${section}\', ${groceryStoreId})`;
    try {
      const data = await this.db.executeSql(insertSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store section ${section}`);
      console.log(err);
    }
  }

  public async queryGroceryStoreSections(id: number): Promise<Set<string>> {
    try {
      const ret = new Set<string>();
      console.log(`In queryGroceryStoreSectionsPromise ${id}`);
      // tslint:disable-next-line:max-line-length
      const sqlQueryGrocerySections = `SELECT * from ${pantrySchema.StoreGrocerySectionTable.NAME} WHERE ${pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID} = \'${id}\'`;
      console.log(`running query: ${sqlQueryGrocerySections}`);
      const data = await this.db.executeSql(sqlQueryGrocerySections, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to grocery section');
        for (let i = 0; i < data.rows.length; i++) {
          ret.add(data.rows.item(i)[StoreGrocerySectionTable.COLS.GROCERY_SECTION]);
        }
        return ret;
      } else {
        console.log('no grocery sections returned for query store by id');
        return ret;
      }
    } catch (err) {
      console.log('Error querying store sections by id');
      console.log(err);
      return null;
    }
  }
  public async deleteGroceryStoreSection(id: number, section: string): Promise<number> {
    const  deleteSql = `DELETE FROM ${pantrySchema.StoreGrocerySectionTable.NAME}
     WHERE ${pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID} = ${id} and
      ${pantrySchema.StoreGrocerySectionTable.COLS.GROCERY_SECTION} = \'${section}\'`;
    try {
      const data = await this.db.executeSql(deleteSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting grocery store section ${section}`);
      console.log(err);
    }
  }
  // endregion
  // region GroceryStoreAisle CRUD
  public async insertGroceryStoreAisle(groceryStoreId: number, aisle: string): Promise<number> {
    const insertSql = `INSERT INTO
     ${pantrySchema.StoreGroceryAisleTable.NAME}
     (${pantrySchema.StoreGroceryAisleTable.COLS.GROCERY_AISLE}, ${pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID})
      VALUES(\'${aisle}\', ${groceryStoreId})`;
    try {
      const data = await this.db.executeSql(insertSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store aisle ${aisle}`);
      console.log(err);
    }
  }
  public async queryGroceryStoreAisles(id: number): Promise<Set<string>> {
    try {
      const ret = new Set<string>();
      console.log(`In queryGroceryStoreAislesPromise ${id}`);
      // tslint:disable-next-line:max-line-length
      const sqlQueryAisles = `SELECT * from ${pantrySchema.StoreGroceryAisleTable.NAME} WHERE ${pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID} = \'${id}\'`;
      console.log(`running query: ${sqlQueryAisles}`);
      const data = await this.db.executeSql(sqlQueryAisles, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to grocery aisle');
        for (let i = 0; i < data.rows.length; i++) {
          ret.add(data.rows.item(i)[StoreGroceryAisleTable.COLS.GROCERY_AISLE]);
        }
        return ret;
      } else {
        console.log('no aisles returned for query store by id');
        return ret;
      }
    } catch (err) {
      console.log('Error querying store aisles by id');
      console.log(err);
      return null;
    }
  }
  public async deleteGroceryStoreAisle(id: number, aisle: string): Promise<number> {
    const  deleteSql = `DELETE FROM ${pantrySchema.StoreGroceryAisleTable.NAME}
     WHERE ${pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID} = ${id} and
      ${pantrySchema.StoreGroceryAisleTable.COLS.GROCERY_AISLE} = \'${aisle}\'`;
    try {
      const data = await this.db.executeSql(deleteSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting grocery store aisle ${aisle}`);
      console.log(err);
    }
  }
  // endregion
  // region GroceryStore CRUD
  public async insertGroceryStore(groceryStoreName: string): Promise<number> {
    const insertSql = `INSERT INTO
     ${pantrySchema.StoreTable.NAME}
     (${pantrySchema.StoreTable.COLS.STORE_NAME})
      VALUES(\'${groceryStoreName}\')`;
    console.log('executing: ' + insertSql);
    try {
      const data = await this.db.executeSql(insertSql, []);
      console.log(`returning ${data} from insertGroceryStore`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store ${groceryStoreName}`);
      console.log(err);
    }
  }

  public async queryGroceryStoreByName(name: string): Promise<GroceryStore> {
    try {
      console.log(`In queryGroceryStoreByName ${name}`);
      const sqlQueryByName = `SELECT * from ${pantrySchema.StoreTable.NAME} WHERE ${pantrySchema.StoreTable.COLS.STORE_NAME} = \'${name}\'`;
      console.log(`running query: ${sqlQueryByName}`);
      const data = await this.db.executeSql(sqlQueryByName, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to groceryStore');
        return DbRowConverters.rowToGroceryStore(data.rows.item(0));
      } else {
        console.log('no groceryStore returned for query store by name');
        return null;
      }
    } catch (err) {
      console.log('Error querying store by name');
      console.log(err);
      return null;
    }
  }

  public async queryGroceryStoreById(id: number): Promise<GroceryStore> {
    try {
      console.log(`In queryGroceryStoreById ${id}`);
      // tslint:disable-next-line:max-line-length
      const sqlQueryById = `SELECT * from ${pantrySchema.StoreTable.NAME} INNER JOIN ${pantrySchema.StoreGroceryAisleTable.NAME} ON ${pantrySchema.StoreGroceryAisleTable.NAME}.${StoreGroceryAisleTable.COLS.STORE_ID} = ${pantrySchema.StoreTable.NAME}.${StoreTable.COLS.ID}\n
      WHERE ${pantrySchema.StoreTable.NAME}.${pantrySchema.StoreTable.COLS.ID} = \'${id}\'`;
      console.log(`running query: ${sqlQueryById}`);
      const data = await this.db.executeSql(sqlQueryById, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to groceryStore');
        return DbRowConverters.rowToGroceryStore(data.rows.item(0));
      } else {
        console.log('no groceryStore returned for query store by id');
        return null;
      }
    } catch (err) {
      console.log('Error querying store by name');
      console.log(err);
      return null;
    }
  }

  public async queryGroceryStores(): Promise<GroceryStore[]> {
    const groceryStores: GroceryStore[] = [];
    try {
      const data = await this.db.executeSql(`SELECT * FROM ${StoreTable.NAME}`, []);
      for (let i = 0; i < data.rows.length; i++) {
        groceryStores.push(DbRowConverters.rowToGroceryStore(data.rows.item(i)));
      }
    } catch (err) {
      console.log('Error querying for grocery stores');
      console.log(err);
    }
    console.log('returning from query');
    console.log(groceryStores);
    return groceryStores;
  }

  public async deleteGroceryStore(id: number): Promise<number> {
    const deleteSql = `DELETE FROM ${pantrySchema.StoreTable.NAME} WHERE ${pantrySchema.StoreTable.COLS.ID} = ${id}`;
    try {
      const data = await this.db.executeSql(deleteSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting grocery store ${id}`);
      console.log(err);
    }
  }
  // endregion
    // region PantryItemLocation CRUD
  public async insertPantryItemLocation(pantryItemId: number,
                                        storeId: number,
                                        aisle: string,
                                        section: string): Promise<GroceryStoreLocation> {
/*
INSERT INTO grocery_item_locations (store_id, store_aisle, section_name)
SELECT 1, '', ''
WHERE NOT EXISTS(
select location_id from grocery_Item_locations WHERE store_id=1 AND store_aisle = '' AND section_name = '' limit 1
)

INSERT INTO pantryitemlocationtable (pantryitemid, locationid)
	SELECT 1, location_id
	from grocery_Item_locations
	WHERE store_id=1 AND store_aisle = '' AND section_name = '' limit 1;
 */
    let result: GroceryStoreLocation = null;
    const fromLocationTableClause = `FROM ${pantrySchema.LocationTable.NAME}`;

    const fromLocationTableWithJoinClause = `FROM ${pantrySchema.LocationTable.NAME} JOIN ${pantrySchema.StoreTable.NAME}
    ON ${pantrySchema.LocationTable.COLS.STORE_ID} = ${pantrySchema.StoreTable.COLS.ID}`;

    const whereLocationClause = `WHERE ${pantrySchema.LocationTable.COLS.STORE_ID}=${storeId}
     AND ${pantrySchema.LocationTable.COLS.AISLE} = '${aisle}'
     AND ${pantrySchema.LocationTable.COLS.SECTION_NAME} = '${section}' limit 1`;

    const insertGroceryStoreIfNecessarySql = `INSERT INTO ${pantrySchema.LocationTable.name} (
    ${pantrySchema.LocationTable.COLS.STORE_ID},
    ${pantrySchema.LocationTable.COLS.AISLE},
    ${pantrySchema.LocationTable.COLS.SECTION_NAME})
     SELECT ${storeId}, '${aisle}', '${section}'
     WHERE NOT EXISTS(select ${pantrySchema.LocationTable.COLS.ID} ${fromLocationTableClause} ${whereLocationClause};`;

    const insertPantryItemSql = `INSERT INTO
     ${pantrySchema.PantryItemLocationTable.NAME}
     (${pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID},
     ${pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID})
      SELECT ${pantryItemId}, ${pantrySchema.LocationTable.COLS.ID}
      ${fromLocationTableClause} ${whereLocationClause};`;

    const selectGroceryStoreLocation = `SELECT
    ${pantrySchema.LocationTable.COLS.ID},
    ${pantrySchema.LocationTable.COLS.STORE_ID},
    ${pantrySchema.StoreTable.COLS.STORE_NAME},
    ${pantrySchema.LocationTable.COLS.AISLE},
    ${pantrySchema.LocationTable.COLS.SECTION_NAME}
      ${fromLocationTableWithJoinClause} ${whereLocationClause}`;
    console.log('executing: ');
    console.log (insertGroceryStoreIfNecessarySql);
    console.log(insertPantryItemSql);

    try {
      const data = await this.db.sqlBatch([insertGroceryStoreIfNecessarySql, insertPantryItemSql, selectGroceryStoreLocation]);
      console.log(`returning ${data} from insertPantryItemLocation`);
      result = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(0));
    } catch (err) {
      console.log(`Error inserting pantry Item location `);
      console.log(err);
    }
    return result;
  }

  public async updatePantryItemLocation(pantryItemId: number,
                                        originalLocationId: number,
                                        storeId: number,
                                        aisle: string,
                                        section: string): Promise<GroceryStoreLocation> {
    let result: GroceryStoreLocation = null;
    const fromLocationTableClause = `FROM ${pantrySchema.LocationTable.NAME}`;

    const fromLocationTableWithJoinClause = `FROM ${pantrySchema.LocationTable.NAME} JOIN ${pantrySchema.StoreTable.NAME}
    ON ${pantrySchema.LocationTable.COLS.STORE_ID} = ${pantrySchema.StoreTable.COLS.ID}`;

    const whereLocationClause = `WHERE ${pantrySchema.LocationTable.COLS.STORE_ID}=${storeId}
     AND ${pantrySchema.LocationTable.COLS.AISLE} = '${aisle}'
     AND ${pantrySchema.LocationTable.COLS.SECTION_NAME} = '${section}' limit 1`;

    const insertGroceryLocationIfNecessarySql = `INSERT INTO ${pantrySchema.LocationTable.name} (
    ${pantrySchema.LocationTable.COLS.STORE_ID},
    ${pantrySchema.LocationTable.COLS.AISLE},
    ${pantrySchema.LocationTable.COLS.SECTION_NAME})
     SELECT ${storeId}, '${aisle}', '${section}'
     WHERE NOT EXISTS(select ${pantrySchema.LocationTable.COLS.ID} ${fromLocationTableClause} ${whereLocationClause};`;

    const updatePantryItemSql = `UPDATE
     ${pantrySchema.PantryItemLocationTable.NAME}
     SET ${pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID} =
     (SELECT ${pantrySchema.LocationTable.COLS.ID} fromLocationTableClause
     WHERE ${whereLocationClause})
     WHERE ${pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${pantryItemId}
     AND ${pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID} = ${originalLocationId};`;

    const selectGroceryStoreLocation = `SELECT
    ${pantrySchema.LocationTable.COLS.ID},
    ${pantrySchema.LocationTable.COLS.STORE_ID},
    ${pantrySchema.StoreTable.COLS.STORE_NAME},
    ${pantrySchema.LocationTable.COLS.AISLE},
    ${pantrySchema.LocationTable.COLS.SECTION_NAME}
      ${fromLocationTableWithJoinClause} ${whereLocationClause}`;
    console.log('executing: ');
    console.log (insertGroceryLocationIfNecessarySql);
    console.log(updatePantryItemSql);

    try {
      const data = await this.db.sqlBatch([insertGroceryLocationIfNecessarySql, updatePantryItemSql, selectGroceryStoreLocation]);
      console.log(`returning ${data} from updatePantryItemLocation`);
      result = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(0));
    } catch (err) {
      console.log(`Error inserting pantry Item location `);
      console.log(err);
    }
    return result;
  }

  public async queryPantryItemLocations(pantryItemId: number): Promise<GroceryStoreLocation[]> {
    const selectSql = `SELECT * FROM ${pantrySchema.LocationTable}
    JOIN ${pantrySchema.StoreTable.NAME} on ${pantrySchema.StoreTable.COLS.ID}=${pantrySchema.LocationTable.COLS.STORE_ID}
      WHERE ${pantrySchema.LocationTable.COLS.ID} IN
      SELECT ${pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID} FROM ${pantrySchema.PantryItemLocationTable.NAME}
      WHERE ${pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${pantryItemId}`;
    const result: GroceryStoreLocation[] = [];
    try {
      const data = await this.db.executeSql(selectSql, []);
      for (let i = 0; i < data.rows.length; i++) {
        const pantryItemLocation = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(i));
        result.push(pantryItemLocation);
      }
    } catch (err) {
      console.log('Error querying for pantry Item eLocations');
      console.log(err);
    }
    console.log('returning from query');
    console.log(result);
    return result;
  }

  public async queryAllPantryItemLocations(): Promise<Map<number, PantryItemLocation[]>> {
    const locations: Map<number, PantryItemLocation[]> = new Map<number, PantryItemLocation[]>();
    try {
      const data = await this.db.executeSql(`SELECT  * FROM ${PantryItemLocationTable.NAME}`, []);
      for (let i = 0; i < data.rows.length; i++) {
        const pantryItemLocation = DbRowConverters.rowToPantryItemLocation(data.rows.item(i));
        if (locations.has(pantryItemLocation.pantryItemId)) {
          locations[pantryItemLocation.pantryItemId].push(pantryItemLocation);
        } else {
          locations.set(pantryItemLocation.pantryItemId, [pantryItemLocation]);
        }
      }
    } catch (err) {
      console.log('Error querying for pantry Item eLocations');
      console.log(err);
    }
    console.log('returning from query');
    console.log(locations);
    return locations;
  }

  public async queryPantryItemLocation(pantryitemId: number, groceryStoreLocationId: number): Promise<PantryItemLocation> {
    const sqlQueryByName = `SELECT * from ${pantrySchema.PantryItemLocationTable.NAME}
       WHERE ${pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${pantryitemId}
       AND ${pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID} = ${groceryStoreLocationId}`;
    console.log(`running query: ${sqlQueryByName}`);
    const data = await this.db.executeSql(sqlQueryByName, []);
    if (data.rows.length > 0) {
      console.log('at least 1 row returned, converting first row to pantryItemLocation');
      return DbRowConverters.rowToPantryItemLocation(data.rows.item(0));
    } else {
      console.log('no pantryItem returned for query pantryItem by name');
      return null;
    }
  }

  public async deletePantryItemLocation(pantryItemId: number, locationId: number): Promise<number> {
      const  deleteSql = `DELETE FROM ${pantrySchema.PantryItemLocationTable.NAME}
      WHERE ${pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${pantryItemId}
      AND ${pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID} = ${locationId}`;
      try {
      const data = await this.db.executeSql(deleteSql, []);
      console.log(`returning ${data} from deletePantryItemLocation`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting pantry ite  location ${pantryItemId}, ${locationId}`);
      console.log(err);
    }
  }
    // endregion
}
