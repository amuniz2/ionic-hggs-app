import {from, Observable, of} from 'rxjs';
import {GroceryStore} from '../modules/store-management/model/grocery-store';
import {AppState} from '../store/app.state';
import {Store} from '@ngrx/store';
import {DatabaseOpenFailed} from '../store';
import * as pantrySchema from './pantry-db-schema';
import {PantryItemTable, StoreGroceryAisleTable, StoreTable} from './pantry-db-schema';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Injectable} from '@angular/core';
import {mergeMap, switchMap} from 'rxjs/operators';

@Injectable()
export class PantryDbHelper {

  constructor(private store: Store<AppState>, private sqlite: SQLite) {
    this.db = null;
  }
  private db: SQLiteObject;
  // private static final String AUTO_INCREMENT_PRIMARYKEY_DEFINITION = " _id integer primary key autoincrement, ";
  // private static final String CREATE_INDEX_COMMAND_FORMAT = "CREATE INDEX %s ON %s (%s);";
  private static BuildForeignKeyConstraintDefinition(columnName: string, referenceTableName: string, foreignKeyColumnName: string): string {
    return `FOREIGN KEY(${columnName}) REFERENCES ${referenceTableName}(${foreignKeyColumnName})`;
  }

  private static BuildUniqueConstraint(constraintName: string, columnName: string) {
    return `CONSTRAINT ${constraintName} UNIQUE (${columnName})`;
  }

  // helpers
  private static rowToGroceryStore(row: any): GroceryStore {
    // todo: read aisles, sections, and locations
    console.log('converting row to GroceryStore:');
    console.log(row);
    return {
      name: row[StoreTable.COLS.STORE_NAME],
      aisles: null,
      sections: null,
      id: row[StoreTable.COLS.ID],
      locations: null
    };
  }

  public connect(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.openOrCreateDb()
        .then((success) => {
          observer.next(success);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  private async openOrCreateDb(): Promise<boolean> {
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
      PantryDbHelper.BuildForeignKeyConstraintDefinition(
        pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID,
        pantrySchema.StoreTable.NAME,
        pantrySchema.StoreTable.COLS.ID);

    const aisleColumnDefinitions =
      pantrySchema.StoreGroceryAisleTable.COLS.GROCERY_AISLE + ' TEXT NOT NULL, ' +
      pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID + ' INTEGER, ' +
      PantryDbHelper.BuildForeignKeyConstraintDefinition(
        pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID,
        pantrySchema.StoreTable.NAME,
        pantrySchema.StoreTable.COLS.ID);

    const locationColumnDefinitions =
      pantrySchema.LocationTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      pantrySchema.LocationTable.COLS.SECTION_NAME + ', ' +
      pantrySchema.LocationTable.COLS.STORE_ID + ' INTEGER, ' +
      pantrySchema.LocationTable.COLS.AISLE + ', ' +
      PantryDbHelper.BuildForeignKeyConstraintDefinition(
        pantrySchema.LocationTable.COLS.STORE_ID,
        pantrySchema.StoreTable.NAME,
        pantrySchema.StoreTable.COLS.ID);

    const pantryItemLocationColumnDefinitions =
      pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID + ' INTEGER, ' +
      pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID + ' INTEGER, ' +
      PantryDbHelper.BuildForeignKeyConstraintDefinition(
        pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID,
        pantrySchema.PantryItemTable.NAME,
        pantrySchema.PantryItemTable.COLS.ID ) + ', ' +
      PantryDbHelper.BuildForeignKeyConstraintDefinition(
        pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID,
        pantrySchema.LocationTable.NAME,
        pantrySchema.LocationTable.COLS.ID);

    const shoppingItemColumnDefinitions =
      pantrySchema.PantryItemTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      pantrySchema.ShoppingItemTable.COLS.IN_CART + ' TINYINT, ' +
      pantrySchema.ShoppingItemTable.COLS.SELECTED + ' TINYINT, ' +
      pantrySchema.ShoppingItemTable.COLS.QUANTITY + ' REAL, ' +
      pantrySchema.ShoppingItemTable.COLS.UNITS + ' TEXT, ' +
      PantryDbHelper.BuildForeignKeyConstraintDefinition(pantrySchema.ShoppingItemTable.COLS.PANTRY_ITEM_ID,
        pantrySchema.PantryItemTable.NAME, pantrySchema.PantryItemTable.COLS.ID ) + ', ' +
      PantryDbHelper.BuildUniqueConstraint(pantrySchema.ShoppingItemTable.NAME, pantrySchema.ShoppingItemTable.COLS.PANTRY_ITEM_ID);

    const storeColumnDefinitions =
      pantrySchema.StoreTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      pantrySchema.StoreTable.COLS.STORE_NAME + ' TEXT NOT NULL, ' +
      PantryDbHelper.BuildUniqueConstraint(pantrySchema.StoreTable.NAME, pantrySchema.StoreTable.COLS.STORE_NAME);

    const pantryItemColumnDefinitions =
      pantrySchema.PantryItemTable.COLS.DESCRIPTION + ' TEXT, ' +
      pantrySchema.PantryItemTable.COLS.SELECT_BY_DEFAULT + ' TINYINT, ' +
      pantrySchema.PantryItemTable.COLS.DEFAULT_QUANTITY + ' REAL, ' +
      pantrySchema.PantryItemTable.COLS.UNITS + ' TEXT, ' +
      pantrySchema.PantryItemTable.COLS.NAME + ' TEXT NOT NULL, ' +
      pantrySchema.PantryItemTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
      PantryDbHelper.BuildUniqueConstraint(pantrySchema.PantryItemTable.NAME, pantrySchema.PantryItemTable.COLS.NAME);

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

  // private createOrOpenTablesOld(): Promise<boolean> {
  //   const sectionColumnDefinitions =
  //     pantrySchema.StoreGrocerySectionTable.COLS.GROCERY_SECTION + ' TEXT NOT NULL, ' +
  //     pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID + ' INT, ' +
  //     PantryDbHelper.BuildForeignKeyConstraintDefinition(
  //       pantrySchema.StoreGrocerySectionTable.COLS.STORE_ID,
  //       pantrySchema.StoreTable.NAME,
  //       pantrySchema.StoreTable.COLS.ID);
  //
  //   const aisleColumnDefinitions =
  //     pantrySchema.StoreGroceryAisleTable.COLS.GROCERY_AISLE + ' TEXT NOT NULL, ' +
  //     pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID + ' INTEGER, ' +
  //     PantryDbHelper.BuildForeignKeyConstraintDefinition(
  //       pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID,
  //       pantrySchema.StoreTable.NAME,
  //       pantrySchema.StoreTable.COLS.ID);
  //
  //   const locationColumnDefinitions =
  //     pantrySchema.LocationTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
  //     pantrySchema.LocationTable.COLS.SECTION_NAME + ', ' +
  //     pantrySchema.LocationTable.COLS.STORE_ID + ' INTEGER, ' +
  //     pantrySchema.LocationTable.COLS.AISLE + ', ' +
  //     PantryDbHelper.BuildForeignKeyConstraintDefinition(
  //       pantrySchema.LocationTable.COLS.STORE_ID,
  //       pantrySchema.StoreTable.NAME,
  //       pantrySchema.StoreTable.COLS.ID);
  //
  //   const pantryItemLocationColumnDefinitions =
  //     pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID + ' INTEGER, ' +
  //     pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID + ' INTEGER, ' +
  //     PantryDbHelper.BuildForeignKeyConstraintDefinition(
  //       pantrySchema.PantryItemLocationTable.COLS.PANTRY_ITEM_ID,
  //       pantrySchema.PantryItemTable.NAME,
  //       pantrySchema.PantryItemTable.COLS.ID ) + ', ' +
  //     PantryDbHelper.BuildForeignKeyConstraintDefinition(
  //       pantrySchema.PantryItemLocationTable.COLS.LOCATION_ID,
  //       pantrySchema.LocationTable.NAME,
  //       pantrySchema.LocationTable.COLS.ID);
  //
  //   const shoppingItemColumnDefinitions =
  //     pantrySchema.PantryItemTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
  //     pantrySchema.ShoppingItemTable.COLS.IN_CART + ' TINYINT, ' +
  //     pantrySchema.ShoppingItemTable.COLS.SELECTED + ' TINYINT, ' +
  //     pantrySchema.ShoppingItemTable.COLS.QUANTITY + ' REAL, ' +
  //     pantrySchema.ShoppingItemTable.COLS.UNITS + ' TEXT, ' +
  //     PantryDbHelper.BuildForeignKeyConstraintDefinition(pantrySchema.ShoppingItemTable.COLS.PANTRY_ITEM_ID,
  //       pantrySchema.PantryItemTable.NAME, pantrySchema.PantryItemTable.COLS.ID ) + ', ' +
  //     PantryDbHelper.BuildUniqueConstraint(pantrySchema.ShoppingItemTable.NAME, pantrySchema.ShoppingItemTable.COLS.PANTRY_ITEM_ID);
  //
  //   const storeColumnDefinitions =
  //     pantrySchema.StoreTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
  //     pantrySchema.StoreTable.COLS.STORE_NAME + ' TEXT NOT NULL, ' +
  //     PantryDbHelper.BuildUniqueConstraint(pantrySchema.StoreTable.NAME, pantrySchema.StoreTable.COLS.STORE_NAME);
  //
  //   const pantryItemColumnDefinitions =
  //     pantrySchema.PantryItemTable.COLS.DESCRIPTION + ' TEXT, ' +
  //     pantrySchema.PantryItemTable.COLS.SELECT_BY_DEFAULT + ' TINYINT, ' +
  //     pantrySchema.PantryItemTable.COLS.DEFAULT_QUANTITY + ' REAL, ' +
  //     pantrySchema.PantryItemTable.COLS.UNITS + ' TEXT, ' +
  //     pantrySchema.PantryItemTable.COLS.NAME + ' TEXT NOT NULL, ' +
  //     pantrySchema.PantryItemTable.COLS.ID + ' INTEGER PRIMARY KEY ASC, ' +
  //     PantryDbHelper.BuildUniqueConstraint(pantrySchema.PantryItemTable.NAME, pantrySchema.PantryItemTable.COLS.NAME);
  //
  //   let pantryItemTableCreated = false;
  //   let locationTableCreated = false;
  //   let pantryItemLocationTableCreated = false;
  //   let grocerySectionTableCreated = false;
  //   let groceryAisleTableCrated = false;
  //   let shoppingItemTableCreated = false;
  //   const allTablesCreated = () => pantryItemLocationTableCreated
  //     && grocerySectionTableCreated
  //     && groceryAisleTableCrated
  //     && shoppingItemTableCreated;
  //
  //   const createLocationTablePromise = this.createTableIfNeeded(pantrySchema.LocationTable.NAME, locationColumnDefinitions);
  //   const createPantryItemLocationTablePromise =
  //   this.createTableIfNeeded(pantrySchema.PantryItemLocationTable.NAME, pantryItemLocationColumnDefinitions);
  //   const createStoreGrocerySectionTablePromise =
  //   this.createTableIfNeeded(pantrySchema.StoreGrocerySectionTable.NAME, sectionColumnDefinitions);
  //   const createStoreGroceryAisleTablePromise =
  //   this.createTableIfNeeded(pantrySchema.StoreGroceryAisleTable.NAME, aisleColumnDefinitions);
  //   const createPantryItemTablePromise = this.createTableIfNeeded(pantrySchema.PantryItemTable.NAME, pantryItemColumnDefinitions);
  //   const createShoppingItemTablePromise = this.createTableIfNeeded(
  //     pantrySchema.ShoppingItemTable.NAME,
  //     shoppingItemColumnDefinitions);
  //
  //   this.createTableIfNeeded(pantrySchema.StoreTable.NAME, storeColumnDefinitions).then(() => {
  //       this.createTableIfNeeded(pantrySchema.LocationTable.NAME, locationColumnDefinitions).then(() => {
  //         locationTableCreated = true;
  //         if (pantryItemTableCreated) {
  //           this.createTableIfNeeded(pantrySchema.PantryItemLocationTable.NAME, pantryItemLocationColumnDefinitions).then(() => {
  //             pantryItemLocationTableCreated = true;
  //             if (allTablesCreated()) {
  //               return of(true);
  //             }
  //           }).catch((err) => {
  //             console.log(err);
  //             return of(false);
  //           });
  //         }
  //       });
  //       this.createTableIfNeeded(pantrySchema.StoreGrocerySectionTable.NAME, sectionColumnDefinitions).then(() => {
  //         grocerySectionTableCreated = true;
  //         if (allTablesCreated()) {
  //           return of(true);
  //         }
  //       }).catch((err) => {
  //         console.log(err);
  //         return of(false);
  //       });
  //       this.createTableIfNeeded(pantrySchema.StoreGroceryAisleTable.NAME, aisleColumnDefinitions).then(() => {
  //         groceryAisleTableCrated = true;
  //         if (allTablesCreated()) {
  //           return of(true);
  //         }
  //       }).catch((err) => {
  //         console.log(err);
  //         return of(false);
  //       });
  //     });
  //   this.createTableIfNeeded(pantrySchema.PantryItemTable.NAME, pantryItemColumnDefinitions).then(() => {
  //       pantryItemTableCreated = true;
  //       this.createTableIfNeeded(
  //         pantrySchema.ShoppingItemTable.NAME,
  //         shoppingItemColumnDefinitions).then(() => shoppingItemTableCreated = true);
  //       if (locationTableCreated) {
  //         this.createTableIfNeeded(pantrySchema.PantryItemLocationTable.NAME, pantryItemLocationColumnDefinitions).then(() => {
  //           pantryItemLocationTableCreated = true;
  //           if (allTablesCreated()) {
  //             return of(true);
  //           }
  //         });
  //       }
  //     });
  // }
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

  public getAllGroceryStores(): Observable<GroceryStore[]> {
    return new Observable<GroceryStore[]>((observer) => {
        this.openOrCreateDb().then((result) => {
          console.log(`openOrCreateDb returned ${result}`);
          if (result) {
            this.queryGroceryStores().then((stores) => {
              console.log('returning observable for stores');
              observer.next(stores);
              observer.complete();
            }).catch((err) => observer.error(err));
          }
        }).catch((err) => {
          console.log('error in call to openOrCreateDb');
          observer.error(err);
        });
      }
    );
  }

  public addGroceryStore(name: string): Observable<GroceryStore> {
    return this.connect().pipe(
      mergeMap((success) => this.insertGroceryStore(name)),
      switchMap((id) => {
        return this.queryGroceryStoreByName(name);
      })
    );
  }

  public deleteGroceryStore(id: number): Observable<boolean> {
    return this.connect().pipe(
      mergeMap((success) => this.deleteGroceryStoreById(id))
    );
  }
  public addGroceryStoreAisle(groceryStoreId: number, aisle: string): Observable<GroceryStore> {
    return this.connect().pipe(
      mergeMap((success) => this.insertGroceryStoreAisle(groceryStoreId, aisle)),
      switchMap((rowsAffected) => {
        if (rowsAffected > 1) {
          return this.queryGroceryStoreById(groceryStoreId);
        }
      })
    );
  }
  private async queryGroceryStores(): Promise<GroceryStore[]> {
    const groceryStores: GroceryStore[] = [];
    try {
      const data = await this.db.executeSql(`SELECT * FROM ${StoreTable.NAME}`, []);
      for (let i = 0; i < data.rows.length; i++) {
        groceryStores.push(PantryDbHelper.rowToGroceryStore(data.rows.item(i)));
      }
    } catch (err) {
      console.log('Error querying for grocery stores');
      console.log(err);
    }
    console.log('returning from query');
    console.log(groceryStores);
    return groceryStores;
  }

  private deleteGroceryStoreById(id: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.deleteGroceryStorePromise(id).then((rowsAffected) => {
        observer.next(rowsAffected > 0);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private async deleteGroceryStorePromise(id: number): Promise<number> {
    const  deleteSql = `DELETE FROM ${pantrySchema.StoreTable.NAME} WHERE ${pantrySchema.StoreTable.COLS.ID} = ${id}`;
    try {
      const data = await this.db.executeSql(deleteSql, []);
      console.log(`returning ${data} from deleteGroceryStore`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error deleting grocery store ${id}`);
      console.log(err);
    }
  }
  private insertGroceryStore(groceryStoreName: string): Observable<number> {
    return new Observable<number>((observer) => {
      this.insertGroceryStorePromise(groceryStoreName).then((rowsAffected) => {
        observer.next(rowsAffected);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }
  private async insertGroceryStorePromise(groceryStoreName: string): Promise<number> {
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

  private insertGroceryStoreAisle(groceryStoreId: number, aisle: string): Observable<number> {
    return new Observable<number>((observer) => {
      this.insertGroceryStoreAislePromise(groceryStoreId, aisle).then((rowsAffected) => {
        observer.next(rowsAffected);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }
  private async insertGroceryStoreAislePromise(groceryStoreId: number, aisle: string): Promise<number> {
    const insertSql = `INSERT INTO
     ${pantrySchema.StoreGroceryAisleTable.NAME}
     (${pantrySchema.StoreGroceryAisleTable.COLS.GROCERY_AISLE}, ${pantrySchema.StoreGroceryAisleTable.COLS.STORE_ID})
      VALUES(\'${aisle}\', ${groceryStoreId})`;
    console.log('executing: ' + insertSql);
    try {
      const data = await this.db.executeSql(insertSql, []);
      console.log(`returning ${data} from insertGroceryStoreAislePromise`);
      return data.rowsAffected;
    } catch (err) {
      console.log(`Error inserting grocery store aisle ${aisle}`);
      console.log(err);
    }
  }

  private queryGroceryStoreByName(name: string): Observable<GroceryStore> {
    return new Observable<GroceryStore>((observer) => {
      this.queryGroceryStoreByNamePromise(name).then((groceryStore) => {
        observer.next(groceryStore);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private queryGroceryStoreById(id: number): Observable<GroceryStore> {
    return new Observable<GroceryStore>((observer) => {
      this.queryGroceryStoreByIdPromise(name).then((groceryStore) => {
        observer.next(groceryStore);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private async queryGroceryStoreByNamePromise(name: string): Promise<GroceryStore> {
    try {
      console.log(`In queryGroceryStoreByName ${name}`);
      const sqlQueryByName = `SELECT * from ${pantrySchema.StoreTable.NAME} WHERE ${pantrySchema.StoreTable.COLS.STORE_NAME} = \'${name}\'`;
      console.log(`running query: ${sqlQueryByName}`);
      const data = await this.db.executeSql(sqlQueryByName, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to groceryStore');
        return PantryDbHelper.rowToGroceryStore(data.rows.item(0));
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

  private async queryGroceryStoreByIdPromise(id: number): Promise<GroceryStore> {
    try {
      console.log(`In queryGroceryStoreById ${id}`);
      // tslint:disable-next-line:max-line-length
      const sqlQueryById = `SELECT * from ${pantrySchema.StoreTable.NAME} INNER JOIN ${pantrySchema.StoreGroceryAisleTable.NAME} ON ${pantrySchema.StoreGroceryAisleTable.NAME}.${StoreGroceryAisleTable.COLS.STORE_ID} = ${pantrySchema.StoreTable.NAME}.${StoreTable.COLS.ID}\n
      WHERE ${pantrySchema.StoreTable.NAME}.${pantrySchema.StoreTable.COLS.ID} = \'${id}\'`;
      console.log(`running query: ${sqlQueryById}`);
      const data = await this.db.executeSql(sqlQueryById, []);
      if (data.rows.length > 0) {
        console.log('at least 1 row returned, converting first row to groceryStore');
        return PantryDbHelper.rowToGroceryStore(data.rows.item(0));
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
}
