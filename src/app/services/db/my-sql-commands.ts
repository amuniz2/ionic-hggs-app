import {PantryItem} from '../../model/pantry-item';
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
import {ShoppingItem} from '../../model/shopping-item';
import {GroceryStoreSection} from '../../model/grocery-store-section';
import {GroceryStoreAisle} from '../../model/grocery-store-aisle';
import {IdMapping} from '../IPantryDataService';
import {HggsData} from '../../model/hggs-data';
import {Platform} from '@ionic/angular';
import {DatabaseReady} from '../../store';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';

interface GroceryStoreMapping {
  storeIdMapping: IdMapping,
  storeLocationsMappings: IdMapping[]
};


@Injectable()
export class MySqlCommands {
  private db: SQLiteObject;
  private platformReady: boolean;
  constructor(private sqlite: SQLite, private platform: Platform, private store: Store<AppState>) {
    this.db = null;
    this.platformReady = false;
  }

  public async connect(): Promise<boolean> {
    await this.platform.ready();
    return await this.openOrCreateDb();
  }

  // region db commands
  private async openOrCreateDb() : Promise<boolean> {
    let success = false;
    if (this.db !== null) {
      return true;
    }

    try {
      this.db = await this.sqlite.create({name: 'hggs-app.db', location: 'default'});
      if (!!this.db) {
        success = await this.createOrOpenTables(this.db);
        if (success) {
          this.store.dispatch(new DatabaseReady());
        } else {
          console.log('create or open tables failed');
        }
        return success;
      } else {
        console.log('sqlite.create failed');
      }
    }
    catch(err) {
      console.log('screate or open tables failed, err: ');
      console.log(err);
      return false;
    }
    return success;
    // }).catch((err) => {
    //   console.log('sqlite.create failed, err: ');
    //   console.log(err);
    // });
    // return false;
  }

  private async createOrOpenTables(openedDb: SQLiteObject): Promise<boolean> {
    const sectionColumnDefinitions =
      StoreGrocerySectionTable.COLS.GROCERY_SECTION + ' TEXT NOT NULL, ' +
      StoreGrocerySectionTable.COLS.STORE_ID + ' INT, ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        StoreGrocerySectionTable.COLS.STORE_ID,
        StoreTable.NAME,
        StoreTable.COLS.ID) + ' ' +
      MySqlHelpers.BuildUniqueConstraint(StoreGrocerySectionTable.NAME,
        StoreGrocerySectionTable.COLS.STORE_ID,
        StoreGrocerySectionTable.COLS.GROCERY_SECTION);

    const aisleColumnDefinitions =
      StoreGroceryAisleTable.COLS.GROCERY_AISLE + ' TEXT NOT NULL, ' +
      StoreGroceryAisleTable.COLS.STORE_ID + ' INTEGER, ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        StoreGroceryAisleTable.COLS.STORE_ID,
        StoreTable.NAME,
        StoreTable.COLS.ID) + ' ' +
      MySqlHelpers.BuildUniqueConstraint(StoreGroceryAisleTable.NAME,
        StoreGroceryAisleTable.COLS.STORE_ID,
        StoreGroceryAisleTable.COLS.GROCERY_AISLE);

    const locationColumnDefinitions =
      LocationTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      LocationTable.COLS.SECTION_NAME + ', ' +
      LocationTable.COLS.STORE_ID + ' INTEGER, ' +
      LocationTable.COLS.AISLE + ', ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        LocationTable.COLS.STORE_ID,
        StoreTable.NAME,
        StoreTable.COLS.ID) + ' ' +
      MySqlHelpers.BuildUniqueConstraint(LocationTable.NAME,
        LocationTable.COLS.STORE_ID,
        LocationTable.COLS.SECTION_NAME,
        LocationTable.COLS.AISLE) ;

    const pantryItemLocationColumnDefinitions =
      PantryItemLocationTable.COLS.LOCATION_ID + ' INTEGER, ' +
      PantryItemLocationTable.COLS.PANTRY_ITEM_ID + ' INTEGER, ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        PantryItemLocationTable.COLS.PANTRY_ITEM_ID,
        PantryItemTable.NAME,
        PantryItemTable.COLS.ID ) + ', ' +
      MySqlHelpers.BuildForeignKeyConstraintDefinition(
        PantryItemLocationTable.COLS.LOCATION_ID,
        LocationTable.NAME,
        LocationTable.COLS.ID);

    const storeColumnDefinitions =
      StoreTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      StoreTable.COLS.STORE_NAME + ' TEXT NOT NULL, ' +
      MySqlHelpers.BuildUniqueConstraint(StoreTable.NAME, StoreTable.COLS.STORE_NAME);

    const pantryItemColumnDefinitions =
      PantryItemTable.COLS.DESCRIPTION + ' TEXT, ' +
      PantryItemTable.COLS.SELECT_BY_DEFAULT + ' TINYINT, ' +
      PantryItemTable.COLS.NEED + ' TINYINT, ' +
      PantryItemTable.COLS.DEFAULT_QUANTITY + ' REAL, ' +
      PantryItemTable.COLS.QUANTITY_NEEDED + ' REAL, ' +
      PantryItemTable.COLS.UNITS + ' TEXT, ' +
      PantryItemTable.COLS.NAME + ' TEXT NOT NULL, ' +
      PantryItemTable.COLS.IN_CART + ' TINYINT, ' +
      PantryItemTable.COLS.SELECTED + ' TINYINT, ' +
      PantryItemTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      MySqlHelpers.BuildUniqueConstraint(PantryItemTable.NAME, PantryItemTable.COLS.NAME);

    // tslint:disable-next-line:max-line-length
    // console.log(`Creating table definitions ${storeColumnDefinitions}, ${pantryItemColumnDefinitions}, ${sectionColumnDefinitions}, ${aisleColumnDefinitions}`);
    console.log('Creating table definitions');
    await this.createTableIfNeeded(openedDb, StoreTable.NAME, storeColumnDefinitions);
    await this.createTableIfNeeded(openedDb, StoreGrocerySectionTable.NAME, sectionColumnDefinitions);
    await this.createTableIfNeeded(openedDb, StoreGroceryAisleTable.NAME, aisleColumnDefinitions);
    await this.createTableIfNeeded(openedDb, LocationTable.NAME, locationColumnDefinitions);
    await this.createTableIfNeeded(openedDb,
      PantryItemTable.NAME,
      pantryItemColumnDefinitions);

    await this.createTableIfNeeded(openedDb, PantryItemLocationTable.NAME, pantryItemLocationColumnDefinitions);
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
  public async insertPantryItem(pantryItemName: string, description: string,
                                units: string,
                                quantityNeeded: number,
                                defaultQuantity: number,
                                need: boolean): Promise<PantryItem> {
    const insertSql = `INSERT INTO
     ${PantryItemTable.NAME}
     (${PantryItemTable.COLS.NAME},
     ${PantryItemTable.COLS.DESCRIPTION},
     ${PantryItemTable.COLS.UNITS},
     ${PantryItemTable.COLS.QUANTITY_NEEDED},
     ${PantryItemTable.COLS.DEFAULT_QUANTITY},
     ${PantryItemTable.COLS.NEED})
      VALUES(\'${pantryItemName}\', \'${description}\', '${units}', ${quantityNeeded}, ${defaultQuantity}, ${need ? 1 : 0})`;

    try {
      const data = await this.db.executeSql(insertSql, []);
      return await this.queryPantryItemByName(pantryItemName);
    } catch (err) {
      console.log(`Error inserting pantry item ${pantryItemName}: ${JSON.stringify(err)}`);
    }
  }

  public async insertPantryItemInNewLocation(pantryItemName: string, description: string,
                                units: string,
                                quantityNeeded: number,
                                defaultQuantity: number,
                                need: boolean, groceryStoreId: number, aisle: string, section: string): Promise<ShoppingItem>
  {
      const newPantryItem = await this.insertPantryItem(pantryItemName, description, units, quantityNeeded, defaultQuantity, need);
      if (newPantryItem) {
        await this.insertNewPantryItemLocation(newPantryItem.id, groceryStoreId, aisle, section);
        return await this.queryShoppingItem(groceryStoreId, newPantryItem.id);
      }
      throw new Error('Error adding shopping item.');
  }


  public async insertPantryItemInLocation(pantryItemName: string, description: string,
                                          units: string,
                                          quantityNeeded: number,
                                          defaultQuantity: number,
                                          need: boolean,
                                          locationId: number): Promise<boolean>
  {
    const newItemId = (await this.insertPantryItem(pantryItemName, description, units, quantityNeeded, defaultQuantity, need)).id;
    return await this.insertPantryItemLocation(newItemId, locationId);
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
    return pantryItems;
  }

  public async updatePantryItem(updatedPantryItem: PantryItem): Promise<PantryItem> {
    const sqlUpdate = `UPDATE ${PantryItemTable.NAME} SET
       ${PantryItemTable.COLS.NAME}=\'${updatedPantryItem.name}\'
       , ${PantryItemTable.COLS.DESCRIPTION}=\'${updatedPantryItem.description}\'
       , ${PantryItemTable.COLS.QUANTITY_NEEDED}=${updatedPantryItem.quantityNeeded}
       , ${PantryItemTable.COLS.DEFAULT_QUANTITY}=${updatedPantryItem.defaultQuantity}
       , ${PantryItemTable.COLS.UNITS}=\'${updatedPantryItem.units}\'
       , ${PantryItemTable.COLS.NEED}=${updatedPantryItem.need ? 1 : 0}
       , ${PantryItemTable.COLS.IN_CART}=${updatedPantryItem.inCart ? 1 : 0}
        WHERE ${PantryItemTable.COLS.ID} = ${updatedPantryItem.id}`;
    try {
      const data = await this.db.executeSql(sqlUpdate, []);
      return this.queryPantryItem(updatedPantryItem.id);
    } catch (err) {
      console.log(`Error updating pantry item. Sql: ${sqlUpdate}`);
      console.log(err);
      return updatedPantryItem;
    }
  }

  public async updateShoppingItem(storeId: number, pantryItemId: number, inCart: boolean): Promise<ShoppingItem> {
    const sqlUpdate = `UPDATE ${PantryItemTable.NAME} SET
       ${PantryItemTable.COLS.IN_CART}=${inCart ? 1 : 0}
       , ${PantryItemTable.COLS.NEED}=${inCart ? 0 : 1}
        WHERE ${PantryItemTable.COLS.ID} = ${pantryItemId}`;
    try {
      const data = await this.db.executeSql(sqlUpdate, []);
      return this.queryShoppingItem(storeId, pantryItemId);
    } catch (err) {
      console.log(`Error updating shopping item. Sql: ${sqlUpdate}`);
      console.log(err);
      return null;
    }
  }

  public async queryPantryItemByName(name: string): Promise<PantryItem> {
    try {
      const sqlQueryByName = `SELECT * from ${PantryItemTable.NAME}
       WHERE ${PantryItemTable.COLS.NAME} = \'${name}\'`;
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
    const deleteItemLocations = `DELETE FROM ${PantryItemLocationTable.NAME} WHERE ${PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${id}`;
    const  deleteSql = `DELETE FROM ${PantryItemTable.NAME} WHERE ${PantryItemTable.COLS.ID} = ${id}`;
    try {
      const locationsDeleted = await this.db.executeSql(deleteItemLocations, []);
      const data = await this.db.executeSql(deleteSql, []);
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
     ${LocationTable.NAME}
     (${LocationTable.COLS.STORE_ID},
     ${LocationTable.COLS.AISLE},
     ${LocationTable.COLS.SECTION_NAME})
      VALUES(${storeId}, \'${aisle}\', \'${section}\')`;

    try {
      const data = await this.db.executeSql(insertSql, []);
      console.log(`returning ${data.rowsAffected} from insertGroceryStoreLocation`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store location  ${insertSql}`);
      console.log(err);
    }
  }

  public async queryAllGroceryStoreLocations(): Promise<GroceryStoreLocation[]> {
    const locations = [];
    // tslint:disable-next-line:max-line-length
    const query = `SELECT * FROM ${LocationTable.NAME}
      JOIN ${StoreTable.NAME}
      ON ${StoreTable.NAME}.${StoreTable.COLS.ID} = ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID}`;
    try {
      const data = await this.db.executeSql(query, []);
      for (let i = 0; i < data.rows.length; i++) {
        const groceryStoreLocation = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(i));
        locations.push(groceryStoreLocation);
      }
    } catch (err) {
      console.log(`Error querying for grocery storeLocations. Query: ${query}`);
      console.log(err);
    }
    return locations;
  }

  public async queryGroceryStoreLocations(storeId: number): Promise<GroceryStoreLocation[]> {
    const locations = [];
    // tslint:disable-next-line:max-line-length
    const query = `SELECT * FROM ${LocationTable.NAME}
      JOIN ${StoreTable.NAME}
      ON ${StoreTable.NAME}.${StoreTable.COLS.ID} = ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID}
      WHERE ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID} = ${storeId}`;
    try {
      const data = await this.db.executeSql(query, []);
      for (let i = 0; i < data.rows.length; i++) {
        const groceryStoreLocation = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(i));
        locations.push(groceryStoreLocation);
      }
    } catch (err) {
      console.log(`Error querying for grocery storeLocations. Query: ${query}`);
      console.log(err);
    }
    return locations;
  }

  public async updateGroceryStoreLocation(updatedGroceryStoreLocation: GroceryStoreLocation): Promise<boolean> {
    try {
      const sqlUpdate = `UPDATE ${LocationTable.NAME} SET
       ${LocationTable.COLS.STORE_ID}=\'${updatedGroceryStoreLocation.storeId}\'
       , ${LocationTable.COLS.AISLE}=\'${updatedGroceryStoreLocation.aisle}\'
       , ${LocationTable.COLS.SECTION_NAME}=\'${updatedGroceryStoreLocation.section}\'
        WHERE ${LocationTable.COLS.ID} = ${updatedGroceryStoreLocation.id}`;
      console.log(`running sql update: ${sqlUpdate}`);
      const data = await this.db.executeSql(sqlUpdate, []);
      if (data.rows.length > 0) {
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
      const sqlQueryByName = `SELECT * from ${LocationTable.NAME}
      JOIN ${StoreTable.NAME} on ${StoreTable.NAME}.${StoreTable.COLS.ID}=${LocationTable.NAME}.${LocationTable.COLS.STORE_ID}
       WHERE ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID} = ${storeId}
       AND ${LocationTable.NAME}.${LocationTable.COLS.AISLE} = \'${aisle}\'
       AND ${LocationTable.NAME}.${LocationTable.COLS.SECTION_NAME} = \'${section}\'`;
      const data = await this.db.executeSql(sqlQueryByName, []);
      if (data.rows.length > 0) {
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
      const sqlQueryById = `SELECT * from ${LocationTable.NAME}
      JOIN ${StoreTable.NAME} ON ${LocationTable.COLS.STORE_ID} = ${StoreTable.COLS.ID}
       WHERE ${LocationTable.COLS.STORE_ID} = ${id}`;
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
        const sqlQueryById = `SELECT * from ${PantryItemTable.NAME}
       WHERE ${PantryItemTable.COLS.ID} = ${id}`;
        const data = await this.db.executeSql(sqlQueryById, []);
        if (data.rows.length > 0) {
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
    const  deleteSql = `DELETE FROM ${LocationTable.NAME} WHERE ${LocationTable.COLS.ID} = ${id}`;
    try {
      const data = await this.db.executeSql(deleteSql, []);
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
     ${StoreGrocerySectionTable.NAME}
     (${StoreGrocerySectionTable.COLS.GROCERY_SECTION}, ${StoreGrocerySectionTable.COLS.STORE_ID})
      VALUES(\'${section}\', ${groceryStoreId})`;
    try {
      const data = await this.db.executeSql(insertSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store section ${section}`);
      console.log(err);
    }
  }

  public async queryAllGroceryStoreSections(): Promise<GroceryStoreSection[]> {
    try {
      const ret: { storeId: number; section: string }[] = [];
      // tslint:disable-next-line:max-line-length
      const sqlQueryGrocerySections = `SELECT * from ${StoreGrocerySectionTable.NAME}`;
      const data = await this.db.executeSql(sqlQueryGrocerySections, []);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          ret.push({
            storeId: data.rows.item(i)[StoreGrocerySectionTable.COLS.STORE_ID],
            section: data.rows.item(i)[StoreGrocerySectionTable.COLS.GROCERY_SECTION]
          });
        }
        return ret;
      } else {
        return ret;
      }
    } catch (err) {
      console.log('Error querying store sections');
      console.log(err);
      return null;
    }
  }

  public async queryGroceryStoreSections(id: number): Promise<Set<string>> {
    try {
      const ret = new Set<string>();
      // tslint:disable-next-line:max-line-length
      const sqlQueryGrocerySections = `SELECT * from ${StoreGrocerySectionTable.NAME} WHERE ${StoreGrocerySectionTable.COLS.STORE_ID} = \'${id}\'`;
      const data = await this.db.executeSql(sqlQueryGrocerySections, []);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          ret.add(data.rows.item(i)[StoreGrocerySectionTable.COLS.GROCERY_SECTION]);
        }
        return ret;
      } else {
        return ret;
      }
    } catch (err) {
      console.log('Error querying store sections by id');
      console.log(err);
      return null;
    }
  }
  public async deleteGroceryStoreSection(id: number, section: string): Promise<number> {
    const  deleteSql = `DELETE FROM ${StoreGrocerySectionTable.NAME}
     WHERE ${StoreGrocerySectionTable.COLS.STORE_ID} = ${id} and
      ${StoreGrocerySectionTable.COLS.GROCERY_SECTION} = \'${section}\'`;
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
     ${StoreGroceryAisleTable.NAME}
     (${StoreGroceryAisleTable.COLS.GROCERY_AISLE}, ${StoreGroceryAisleTable.COLS.STORE_ID})
      VALUES(\'${aisle}\', ${groceryStoreId})`;
    try {
      const data = await this.db.executeSql(insertSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store aisle ${aisle}`);
      console.log(err);
    }
  }

  public async queryAllGroceryStoreAisles(): Promise<GroceryStoreAisle[]> {
    try {
      const ret: { storeId: number; aisle: string }[] = [];
      const sqlQueryAisles = `SELECT * from ${StoreGroceryAisleTable.NAME}`;
      const data = await this.db.executeSql(sqlQueryAisles, []);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          ret.push({
            storeId: data.rows.item(i)[StoreGroceryAisleTable.COLS.STORE_ID],
            aisle: data.rows.item(i)[StoreGroceryAisleTable.COLS.GROCERY_AISLE]
          });
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

  public async queryGroceryStoreAisles(id: number): Promise<Set<string>> {
    try {
      const ret = new Set<string>();
      // tslint:disable-next-line:max-line-length
      const sqlQueryAisles = `SELECT * from ${StoreGroceryAisleTable.NAME} WHERE ${StoreGroceryAisleTable.COLS.STORE_ID} = \'${id}\'`;
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
    const  deleteSql = `DELETE FROM ${StoreGroceryAisleTable.NAME}
     WHERE ${StoreGroceryAisleTable.COLS.STORE_ID} = ${id} and
      ${StoreGroceryAisleTable.COLS.GROCERY_AISLE} = \'${aisle}\'`;
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
     ${StoreTable.NAME}
     (${StoreTable.COLS.STORE_NAME})
      VALUES(\'${groceryStoreName}\')`;
    try {
      const data = await this.db.executeSql(insertSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store ${groceryStoreName}`);
      console.log(err);
    }
  }

  public async queryGroceryStoreByName(name: string): Promise<GroceryStore> {
    try {
      const sqlQueryByName = `SELECT * from ${StoreTable.NAME} WHERE ${StoreTable.COLS.STORE_NAME} = \'${name}\'`;
      const data = await this.db.executeSql(sqlQueryByName, []);
      if (data.rows.length > 0) {
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
      // tslint:disable-next-line:max-line-length
      const sqlQueryById = `SELECT * from ${StoreTable.NAME} INNER JOIN ${StoreGroceryAisleTable.NAME} ON ${StoreGroceryAisleTable.NAME}.${StoreGroceryAisleTable.COLS.STORE_ID} = ${StoreTable.NAME}.${StoreTable.COLS.ID}\n
      WHERE ${StoreTable.NAME}.${StoreTable.COLS.ID} = \'${id}\'`;
      const data = await this.db.executeSql(sqlQueryById, []);
      if (data.rows.length > 0) {
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
    return groceryStores;
  }

  public async deleteGroceryStore(id: number): Promise<number> {
    const deleteSql = `
    DELETE FROM ${StoreGroceryAisleTable.name} WHERE ${StoreGroceryAisleTable.COLS.STORE_ID} = ${id}
    DELETE FROM ${StoreGrocerySectionTable.name} WHERE ${StoreGrocerySectionTable.COLS.STORE_ID} = ${id}
    DELETE FROM ${PantryItemLocationTable.name} WHERE ${PantryItemLocationTable.COLS.LOCATION_ID}
    IN (SELECT ${LocationTable.COLS.ID} FROM ${LocationTable.NAME} WHERE ${LocationTable.COLS.STORE_ID} = ${id})
    DELETE FROM ${LocationTable.name} WHERE ${LocationTable.COLS.STORE_ID} = ${id}
    DELETE FROM ${StoreTable.NAME} WHERE ${StoreTable.COLS.ID} = ${id}`;
    try {
      const data = await this.db.executeSql(deleteSql, []);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting grocery store ${id}`);
      console.log(err);
      console.log(deleteSql);
    }
  }
  // endregion
    // region PantryItemLocation CRUD
  public async insertNewPantryItemLocation(pantryItemId: number,
                                        storeId: number,
                                        aisle: string,
                                        section: string): Promise<GroceryStoreLocation> {

    let result: GroceryStoreLocation = null;
    const fromLocationTableClause = `FROM ${LocationTable.NAME}`;

    const fromLocationTableWithJoinClause = `FROM ${LocationTable.NAME} JOIN ${StoreTable.NAME}
    ON ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID} = ${StoreTable.NAME}.${StoreTable.COLS.ID}`;

    const whereLocationClause = `WHERE  ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID}=${storeId}
     AND ${LocationTable.NAME}.${LocationTable.COLS.AISLE} = '${aisle}'
     AND ${LocationTable.NAME}.${LocationTable.COLS.SECTION_NAME} = '${section}' limit 1`;

    const insertGroceryStoreLocationIfNecessarySql = `INSERT INTO ${LocationTable.NAME} (
    ${LocationTable.COLS.STORE_ID},
    ${LocationTable.COLS.AISLE},
    ${LocationTable.COLS.SECTION_NAME})
     SELECT ${storeId}, '${aisle}', '${section}'
     WHERE NOT EXISTS(select ${LocationTable.COLS.ID} ${fromLocationTableClause} ${whereLocationClause});`;

    const insertPantryItemSql = `INSERT INTO
     ${PantryItemLocationTable.NAME}
     (${PantryItemLocationTable.COLS.PANTRY_ITEM_ID},
     ${PantryItemLocationTable.COLS.LOCATION_ID})
      SELECT ${pantryItemId}, ${LocationTable.COLS.ID}
      ${fromLocationTableClause} ${whereLocationClause};`;

    const selectGroceryStoreLocation = `SELECT
    ${LocationTable.NAME}.${LocationTable.COLS.ID},
    ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID},
    ${StoreTable.NAME}.${StoreTable.COLS.STORE_NAME},
    ${LocationTable.NAME}.${LocationTable.COLS.AISLE},
    ${LocationTable.NAME}.${LocationTable.COLS.SECTION_NAME}
      ${fromLocationTableWithJoinClause} ${whereLocationClause}`;

    try {
      // const data = await this.db.sqlBatch([insertGroceryStoreIfNecessarySql, insertPantryItemSql, selectGroceryStoreLocation]);
      await this.db.sqlBatch([insertGroceryStoreLocationIfNecessarySql, insertPantryItemSql]);
      const data = await(this.db.executeSql(selectGroceryStoreLocation, []));
      result = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(0));
    } catch (err) {
      console.log(`Error inserting pantry Item location `);
      console.log(err);
    }
    return result;
  }

  public async insertPantryItemLocation(pantryItemId: number,
                                           storeLocationId: number): Promise<boolean> {

    const insertPantryItemLocationSql = `INSERT INTO ${PantryItemLocationTable.NAME} (${PantryItemLocationTable.COLS.PANTRY_ITEM_ID}, ${PantryItemLocationTable.COLS.LOCATION_ID}) VALUES (${pantryItemId}, ${storeLocationId});`;

    try {
      console.log('insert statement: ', insertPantryItemLocationSql);
      const rowsAffected = await this.db.executeSql(insertPantryItemLocationSql, []);
      return (rowsAffected > 0);
    } catch (err) {
      console.log(`Error inserting pantry Item location `);
      console.log(err);
    }
    return false;
  }

  public async updatePantryItemLocation(pantryItemId: number,
                                        originalLocationId: number,
                                        storeId: number,
                                        aisle: string,
                                        section: string): Promise<GroceryStoreLocation> {
    let result: GroceryStoreLocation = null;
    const fromLocationTableClause = `FROM ${LocationTable.NAME}`;

    const fromLocationTableWithJoinClause = `FROM ${LocationTable.NAME} JOIN ${StoreTable.NAME}
    ON ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID} = ${StoreTable.NAME}.${StoreTable.COLS.ID}`;

    const whereLocationClause = `WHERE ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID}=${storeId}
     AND ${LocationTable.NAME}.${LocationTable.COLS.AISLE} = '${aisle}'
     AND ${LocationTable.NAME}.${LocationTable.COLS.SECTION_NAME} = '${section}' limit 1`;

    const insertGroceryLocationIfNecessarySql = `INSERT INTO ${LocationTable.NAME} (
    ${LocationTable.COLS.STORE_ID},
    ${LocationTable.COLS.AISLE},
    ${LocationTable.COLS.SECTION_NAME})
     SELECT ${storeId}, '${aisle}', '${section}'
     WHERE NOT EXISTS(select ${LocationTable.NAME}.${LocationTable.COLS.ID} ${fromLocationTableClause} ${whereLocationClause});`;

    const updatePantryItemLocationSql = `UPDATE
     ${PantryItemLocationTable.NAME}
     SET ${PantryItemLocationTable.COLS.LOCATION_ID} =
     (SELECT ${LocationTable.COLS.ID} ${fromLocationTableClause}
     ${whereLocationClause})
     WHERE ${PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${pantryItemId}
     AND ${PantryItemLocationTable.COLS.LOCATION_ID} = ${originalLocationId};`;

    const selectGroceryStoreLocation = `SELECT
    ${LocationTable.COLS.ID},
    ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID},
    ${StoreTable.COLS.STORE_NAME},
    ${LocationTable.COLS.AISLE},
    ${LocationTable.COLS.SECTION_NAME}
      ${fromLocationTableWithJoinClause} ${whereLocationClause}`;

    try {
      await this.db.sqlBatch([insertGroceryLocationIfNecessarySql, updatePantryItemLocationSql]);
      const data = await this.db.executeSql(selectGroceryStoreLocation, []);
      result = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(0));
    } catch (err) {
      console.log(`Error updating pantry Item location `);
      console.log(err);
    }
    return result;
  }

  public async queryAllPantryItemLocations(): Promise<PantryItemLocation[]> {
    const selectSql = `SELECT * FROM ${PantryItemLocationTable.NAME}`;
    const result: PantryItemLocation[] = [];
    try {
      const data = await this.db.executeSql(selectSql, []);
      for (let i = 0; i < data.rows.length; i++) {
        const pantryItemLocation = DbRowConverters.rowToPantryItemLocation(data.rows.item(i));
        result.push(pantryItemLocation);
      }
    } catch (err) {
      console.log(`Error querying for pantry Item Locations. Query: ${selectSql}`);
      console.log(err);
    }
    return result;
  }

  public async queryPantryItemLocations(pantryItemId: number): Promise<GroceryStoreLocation[]> {
    const selectSql = `SELECT * FROM ${LocationTable.NAME}
    JOIN ${StoreTable.NAME} ON
      ${StoreTable.NAME}.${StoreTable.COLS.ID}=${LocationTable.NAME}.${LocationTable.COLS.STORE_ID}
    WHERE ${LocationTable.NAME}.${LocationTable.COLS.ID} IN
      (SELECT ${PantryItemLocationTable.COLS.LOCATION_ID} FROM ${PantryItemLocationTable.NAME}
      WHERE ${PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${pantryItemId})`;
    const result: GroceryStoreLocation[] = [];
    try {
      const data = await this.db.executeSql(selectSql, []);
      for (let i = 0; i < data.rows.length; i++) {
        const pantryItemLocation = DbRowConverters.rowToGroceryStoreLocation(data.rows.item(i));
        result.push(pantryItemLocation);
      }
    } catch (err) {
      console.log(`Error querying for pantry Item Locations. Query: ${selectSql}`);
      console.log(err);
    }
    console.log(`Returning these locations for pantry item: ${pantryItemId}`, JSON.stringify(result));
    return result;
  }

  public async queryShoppingItems(storeId: number): Promise<ShoppingItem[]> {
    const selectSql = `SELECT * FROM ${PantryItemTable.NAME} INNER JOIN ${PantryItemLocationTable.NAME} ON ${PantryItemLocationTable.NAME}.${PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${PantryItemTable.NAME}.${PantryItemTable.COLS.ID} \
    INNER JOIN ${LocationTable.NAME} ON ${LocationTable.NAME}.${LocationTable.COLS.ID}= \
    ${PantryItemLocationTable.NAME}.${PantryItemLocationTable.COLS.LOCATION_ID} \
      WHERE ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID} = ${storeId} \
      AND ${PantryItemTable.NAME}.${PantryItemTable.COLS.NEED} = 1`;
    const result: ShoppingItem[] = [];
    try {
      const data = await this.db.executeSql(selectSql, []);
      for (let i = 0; i < data.rows.length; i++) {
        const shoppingItem = DbRowConverters.rowToShoppingItem(data.rows.item(i));
        result.push(shoppingItem);
      }
    } catch (err) {
      console.log(`Error querying for shopping items. Query: ${selectSql}`);
      console.log(err);
    }
    return result;
  }

  public async queryShoppingItem(storeId: number, pantryItemId: number): Promise<ShoppingItem> {
    const selectSql = `SELECT * FROM ${PantryItemTable.NAME}
    JOIN ${PantryItemLocationTable.NAME} ON
      ${PantryItemLocationTable.NAME}.${PantryItemLocationTable.COLS.PANTRY_ITEM_ID}=
      ${PantryItemTable.NAME}.${PantryItemTable.COLS.ID}
    JOIN ${LocationTable.NAME} ON ${LocationTable.NAME}.${LocationTable.COLS.ID}=
    ${PantryItemLocationTable.NAME}.${PantryItemLocationTable.COLS.LOCATION_ID}
      WHERE ${LocationTable.NAME}.${LocationTable.COLS.STORE_ID} = ${storeId}
      AND ${PantryItemTable.NAME}.${PantryItemTable.COLS.ID} = ${pantryItemId}`;

    try {
      const data = await this.db.executeSql(selectSql, []);
      if (data.rows.length > 0) {
        const shoppingItemReturned = DbRowConverters.rowToShoppingItem(data.rows.item(0));
        return shoppingItemReturned;
      }
    } catch (err) {
      console.log(`Error querying for shopping items. Query: ${selectSql}`);
      console.log(err);
    }
    return null;
  }

  public async queryPantryItemLocation(pantryitemId: number, groceryStoreLocationId: number): Promise<PantryItemLocation> {
    const sqlQueryByName = `SELECT * from ${PantryItemLocationTable.NAME}
       WHERE ${PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${pantryitemId}
       AND ${PantryItemLocationTable.COLS.LOCATION_ID} = ${groceryStoreLocationId}`;
    const data = await this.db.executeSql(sqlQueryByName, []);
    if (data.rows.length > 0) {
      return DbRowConverters.rowToPantryItemLocation(data.rows.item(0));
    } else {
      console.log('no pantryItem returned for query pantryItem by name');
      return null;
    }
  }

  public async deletePantryItemLocation(pantryItemId: number, locationId: number): Promise<number> {
      const  deleteSql = `DELETE FROM ${PantryItemLocationTable.NAME}
      WHERE ${PantryItemLocationTable.COLS.PANTRY_ITEM_ID} = ${pantryItemId}
      AND ${PantryItemLocationTable.COLS.LOCATION_ID} = ${locationId}`;
      try {
      const data = await this.db.executeSql(deleteSql, []);
      console.log(`returning ${data} from deletePantryItemLocation`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting pantry item  location ${pantryItemId}, ${locationId}`);
      console.log(err);
    }
  }
    // endregion
  public async queryGroceryStoreAislesInUse(groceryStoreId: number): Promise<string[]> {
    return this.queryGroceryStoreAislesOrSectionsInuseInUse(groceryStoreId,
      StoreGroceryAisleTable.NAME,
      StoreGroceryAisleTable.COLS.GROCERY_AISLE,
      StoreGroceryAisleTable.COLS.STORE_ID);
    // const selectSql = `SELECT ${StoreGroceryAisleTable.COLS.GROCERY_AISLE} FROM ${StoreGroceryAisleTable.NAME}
    // JOIN ${LocationTable.NAME}
    //   ON ${LocationTable.COLS.STORE_ID}=${StoreGroceryAisleTable.COLS.STORE_ID}
    //   WHERE ${StoreGroceryAisleTable.COLS.STORE_ID} = ${groceryStoreId} AND
    //   ${LocationTable.COLS.ID} IN
    //   (SELECT ${PantryItemLocationTable.COLS.LOCATION_ID} FROM ${PantryItemLocationTable.NAME})`;
    // const result: string[] = [];
    // try {
    //   const data = await this.db.executeSql(selectSql, []);
    //   for (let i = 0; i < data.rows.length; i++) {
    //     const aisleName = DbRowConverters.rowToString(data.rows.item(i), StoreGroceryAisleTable.COLS.GROCERY_AISLE);
    //     result.push(aisleName);
    //   }
    // } catch (err) {
    //   console.log('Error querying for pantry Item store aisles or sections in use');
    //   console.log(err);
    // }
    // console.log('returning from query');
    // console.log(result);
    // return result;
  }

  public async queryGroceryStoreSectionsInUse(groceryStoreId: number): Promise<string[]> {
    return this.queryGroceryStoreAislesOrSectionsInuseInUse(groceryStoreId,
      StoreGrocerySectionTable.NAME,
      StoreGrocerySectionTable.COLS.GROCERY_SECTION,
      StoreGrocerySectionTable.COLS.STORE_ID);
  }

  public async importHggsData(data: HggsData): Promise<boolean> {
    try {
      const pantryItemMappings = await this.importPantryItems(data.pantryItems);
      const groceryStoreLocationMappings = await this.importGroceryStores(data.groceryStores,
        data.groceryStoreAisles,
        data.groceryStoreSections,
        data.groceryStoreLocations);
      await this.importPantryItemLocations(data.pantryItemLocations, pantryItemMappings, groceryStoreLocationMappings);
      return true;
    }
    catch (error) {
      console.log('Error importing data:');
      console.log(error);
    }
    return false;

  }

  public async cleanupLocations(): Promise<boolean> {
    console.log('Inside cleanupLocatins()');
    let success = await this.deleteUnusedGroceryStoreLocations();
    if (success) {
      success = await this.deleteUnusedGroceryStoreAislesAndSections();
    }
    return success;
  }

  private async queryGroceryStoreAislesOrSectionsInuseInUse(groceryStoreId: number,
                                                            aisleOrSectionTableName,
                                                            aisleOrSectionColumnName,
                                                            storeIdColumnName): Promise<string[]> {
    const selectSql = `SELECT ${aisleOrSectionColumnName} FROM ${aisleOrSectionTableName}
    JOIN ${LocationTable.NAME}
      ON ${LocationTable.COLS.STORE_ID}=${storeIdColumnName}
      WHERE ${storeIdColumnName} = ${groceryStoreId} AND
      ${LocationTable.COLS.ID} IN
      (SELECT ${PantryItemLocationTable.COLS.LOCATION_ID} FROM ${PantryItemLocationTable.NAME})`;
    const result: string[] = [];
    try {
      const data = await this.db.executeSql(selectSql, []);
      for (let i = 0; i < data.rows.length; i++) {
        const aisleName = DbRowConverters.rowToString(data.rows.item(i), aisleOrSectionColumnName);
        result.push(aisleName);
      }
    } catch (err) {
      console.log('Error querying for pantry Item store aisles or sections in use');
      console.log(err);
    }
    return result;
  }

  private async importPantryItems(pantryItems: PantryItem[]): Promise<IdMapping[]> {
    const existingPantryItems = await this.queryPantryItems();
    const result: IdMapping[] = [];
    for (const newPantryItem of pantryItems) {
      if (!existingPantryItems.some(existingItem => newPantryItem.name === existingItem.name)) {
        const pantryItem = await this.insertPantryItem(newPantryItem.name,
          newPantryItem.description,
          newPantryItem.units,
          newPantryItem.quantityNeeded,
          newPantryItem.defaultQuantity,
          newPantryItem.need
        );
        result.push({ importedId: pantryItem.id, originalId: newPantryItem.id})
      } else {
        const existingItem = existingPantryItems.find(pi => pi.name === newPantryItem.name);
        await this.updatePantryItem({
          ...newPantryItem,
          id: existingItem.id
        });
        result.push({ originalId: newPantryItem.id, importedId: existingItem.id});
      }
    }
    return result;
  }

  private async importGroceryStores(groceryStores: GroceryStore[],
                                   groceryStoreAisles: GroceryStoreAisle[],
                                   groceryStoreSections: GroceryStoreSection[],
                                   groceryStoreLocations: GroceryStoreLocation[]): Promise<GroceryStoreMapping[]> {
    const existingGroceryStores = await this.queryGroceryStores();
    const result: GroceryStoreMapping[] = [];

    for (const newGroceryStore of groceryStores) {
      let storeIdMapping: IdMapping;
      if (!existingGroceryStores.some(existingStore => newGroceryStore.name === existingStore.name)) {
        if (await this.insertGroceryStore(newGroceryStore.name) > 0) {
          const insertedGroceryStore = await this.queryGroceryStoreByName(newGroceryStore.name)
          storeIdMapping = {originalId: newGroceryStore.id, importedId: insertedGroceryStore.id};
        }
      } else {
        const existingItemId = existingGroceryStores.find(groceryStore => groceryStore.name === newGroceryStore.name).id;
        storeIdMapping = { originalId: newGroceryStore.id, importedId: existingItemId};
      }
      await this.importGroceryStoreAisles(storeIdMapping, groceryStoreAisles.filter(storeAisle => storeAisle.storeId === storeIdMapping.originalId));
      await this.importGroceryStoreSections(storeIdMapping, groceryStoreSections.filter(storeSection => storeSection.storeId === storeIdMapping.originalId));
      const groceryLocationMappings = await this.importGroceryStoreLocations(storeIdMapping,
        groceryStoreLocations.filter(storeLocation => storeLocation.storeId === storeIdMapping.originalId));
      result.push({
        storeIdMapping,
        storeLocationsMappings: groceryLocationMappings
      });
    }
    return result;
  }

  private async importGroceryStoreAisles(groceryStoreMapping: IdMapping,
                                        newAisles: GroceryStoreAisle[]) {
    const existingAisles = await this.queryGroceryStoreAisles(groceryStoreMapping.importedId);
    for (const newAisle of newAisles) {
      if (!existingAisles.has(newAisle.aisle)) {
        await this.insertGroceryStoreAisle(groceryStoreMapping.importedId, newAisle.aisle);
      }
    }
  }

  private async importGroceryStoreSections(groceryStoreMapping: IdMapping,
                                         newSections: GroceryStoreSection[]) {
    const existingSections = await this.queryGroceryStoreSections(groceryStoreMapping.importedId);
    for (const newSection of newSections) {
      if (!existingSections.has(newSection.section)) {
        await this.insertGroceryStoreSection(groceryStoreMapping.importedId, newSection.section);
      }
    }
  }

  private async importGroceryStoreLocations(groceryStoreMapping: IdMapping,
                                           newLocations: GroceryStoreLocation[]): Promise<IdMapping[]> {
    const existingLocations = await this.queryGroceryStoreLocations(groceryStoreMapping.importedId);
    let locationId: number;
    const result: IdMapping[] = [];

    for (const newLocation of newLocations) {
      if (!existingLocations.some(existingLocation =>
        newLocation.aisle === existingLocation.aisle &&
        newLocation.section === existingLocation.section)) {
        if (await this.insertGroceryStoreLocation(groceryStoreMapping.importedId, newLocation.aisle, newLocation.section) > 0) {
          const importedLocation = await this.queryGroceryStoreLocation(groceryStoreMapping.importedId, newLocation.aisle, newLocation.section);
          locationId = importedLocation.id;
        }
      } else {
        locationId = existingLocations.find(existingLocation =>
          newLocation.aisle === existingLocation.aisle &&
          newLocation.section === existingLocation.section).id;
      }
      result.push({ originalId: newLocation.id, importedId: locationId});
    }
    return result;
  }

  private async importPantryItemLocations(newPantryItemLocations: PantryItemLocation[],
                                          pantryItemMappings: IdMapping[],
                                          groceryStoreMappings: GroceryStoreMapping[]) {

    // const groceryStoreLocations = await this.queryAllGroceryStoreLocations();
    for (const pantryItemMapping of pantryItemMappings) {
      await this.importLocationsForPantryItem(pantryItemMapping,
        newPantryItemLocations.filter(piLocation => piLocation.pantryItemId === pantryItemMapping.originalId),
        groceryStoreMappings/*, groceryStoreLocations*/);
    }
  }

  // todo: study...
  private async importLocationsForPantryItem(pantryItemMapping: IdMapping,
                                          newPantryItemLocations: PantryItemLocation[],
                                          groceryStoreMappings: GroceryStoreMapping[]/*,
                                           existingGroceryStoreLocations: GroceryStoreLocation[]*/) {
    const existingPantryItemLocations = await this.queryPantryItemLocations(pantryItemMapping.importedId);
    console.log('pantryItemMapping:');
    console.log(pantryItemMapping);
    console.log('existing locations for item Id: ', pantryItemMapping.originalId, ' are ', JSON.stringify(existingPantryItemLocations));
    console.log('locations being imported: ', JSON.stringify(newPantryItemLocations));
    // console.log('store mappings: ', JSON.stringify(groceryStoreMappings));
    for (const newPantryItemLocation of newPantryItemLocations) {
      const newGroceryStoreLocationMapping = this.findImportedGroceryStoreLocationMapping(newPantryItemLocation.groceryStoreLocationId, groceryStoreMappings);
      if (!existingPantryItemLocations.some(existingLocation => existingLocation.id === newGroceryStoreLocationMapping.importedId)) {
        console.log('pantryItemLocation being added: ', newGroceryStoreLocationMapping.importedId, ' for pantry item: ', pantryItemMapping.originalId, ' imported id: ',pantryItemMapping.importedId);
        await this.insertPantryItemLocation(pantryItemMapping.importedId, newGroceryStoreLocationMapping.importedId);
      } else {
          console.log('pantryItemLocation not being added, as it already exists: ',
          JSON.stringify(existingPantryItemLocations.find(existingLocation => existingLocation.id === newGroceryStoreLocationMapping.importedId)));
      }
    }
  }

  private findImportedGroceryStoreLocationMapping(newGroceryStoreLocationId: number, groceryStoreMappings: GroceryStoreMapping[]): IdMapping {
    for (const groceryStoreMapping of groceryStoreMappings) {
      const importedLocationMapping = groceryStoreMapping.storeLocationsMappings
        .find(locationMapping => locationMapping.originalId === newGroceryStoreLocationId);
      if (importedLocationMapping) {
        return importedLocationMapping;
      }
    }
    return null;
  }

  private async deleteUnusedGroceryStoreLocations() {
    const sql = `DELETE FROM ${LocationTable.NAME} WHERE NOT EXISTS (
    SELECT 1 FROM ${PantryItemLocationTable.NAME} WHERE ${LocationTable.COLS.ID} = ${PantryItemLocationTable.COLS.LOCATION_ID})`;

    try {
      await this.db.executeSql(sql, []);
      return true;
    } catch (err) {
      console.log(`Error deleting unused grocery store locations, sql: ${sql}`);
      console.log(err);
      return false;
    }
  }

  private async deleteUnusedGroceryStoreAislesAndSections(): Promise<boolean> {
    const deleteAislesSql = `DELETE FROM ${StoreGroceryAisleTable.NAME} WHERE NOT EXISTS (
    SELECT 1 FROM ${LocationTable.NAME}
    WHERE ${StoreGroceryAisleTable.COLS.GROCERY_AISLE} = ${LocationTable.COLS.AISLE}
    AND ${StoreGroceryAisleTable.COLS.STORE_ID} = ${LocationTable.COLS.STORE_ID})`;

    const deleteSectionsSql = `DELETE FROM ${StoreGrocerySectionTable.NAME} WHERE NOT EXISTS (
    SELECT 1 FROM ${LocationTable.NAME}
    WHERE ${StoreGrocerySectionTable.COLS.GROCERY_SECTION} = ${LocationTable.COLS.SECTION_NAME}
    AND ${StoreGrocerySectionTable.COLS.STORE_ID} = ${LocationTable.COLS.STORE_ID})`;

    try {
      await this.db.sqlBatch([deleteAislesSql, deleteSectionsSql]);
      return true;
    } catch(err) {
      console.log(`Error deleting unused aisles and sections, error: ${err}`);
      console.log('delete aisles sql: ', deleteAislesSql);
      console.log('delete sections sql: ', deleteSectionsSql);
      return false;
    }
  }
}
