import {Observable, of} from 'rxjs';
import {GroceryStore} from '../../model/grocery-store';
import {AppState} from '../../store/app.state';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {PantryItem} from '../../model/pantry-item';
import {MySqlCommands} from './my-sql-commands';
import {GroceryStoreLocation} from '../../model/grocery-store-location';
import {PantryItemLocation} from '../../model/PantryItemLocation';

@Injectable()
export class PantryDbHelper {
  constructor(private store: Store<AppState>, private mySqlCommands: MySqlCommands) {
  }

  // helpers
  public connect(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.mySqlCommands.openOrCreateDb()
        .then((success) => {
          observer.next(success);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  public getAllGroceryStores(): Observable<GroceryStore[]> {
    return new Observable<GroceryStore[]>((observer) => {
        this.mySqlCommands.openOrCreateDb().then((result) => {
          console.log(`openOrCreateDb returned ${result}`);
          if (result) {
            this.mySqlCommands.queryGroceryStores().then((stores) => {
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

  public getAllPantryItems(): Observable<PantryItem[]> {
    return new Observable<PantryItem[]>((observer) => {
        this.mySqlCommands.openOrCreateDb().then((result) => {
          if (result) {
            this.mySqlCommands.queryPantryItems().then((items) => {
              observer.next(items);
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

  public getGroceryStoreAisles(groceryStoreId: number): Observable<string[]> {
    return this.queryGroceryStoreAisles(groceryStoreId);
  }

  public getGroceryStoreSections(groceryStoreId: number): Observable<string[]> {
    return this.queryGroceryStoreSections(groceryStoreId);
  }


  public addGroceryStore(name: string): Observable<GroceryStore> {
    return this.connect().pipe(
      mergeMap(( _ ) => this.insertGroceryStore(name)),
      switchMap(( _ ) => {
        return this.queryGroceryStoreByName(name);
      })
    );
  }

  public deleteGroceryStore(id: number): Observable<boolean> {
    return this.connect().pipe(
      mergeMap((success) => this.deleteGroceryStoreById(id))
    );
  }
  public deletePantryItem(id: number): Observable<boolean> {
    return this.connect().pipe(
      mergeMap((success) => this.deletePantryItemById(id))
    );
  }
  public deleteGroceryStoreAisle(id: number, aisle: string): Observable<boolean> {
    return this.connect().pipe(
      mergeMap((success) => success ? this.deleteStoreAisle(id, aisle) :  of(false)));
  }

  public addPantryItem(name: string, description: string): Observable<PantryItem> {
    return this.connect().pipe(
      mergeMap((success) => this.insertPantryItem(name, description)),
      switchMap((rowsAffected) => {
        return this.queryPantryItemByName(name);
      })
    );
  }

  public deleteGroceryStoreSection(id: number, grocerySection: string): Observable<boolean> {
    return this.connect().pipe(
      mergeMap((success) => success ? this.deleteStoreSection(id, grocerySection) :  of(false)));
  }

  public addGroceryStoreAisle(groceryStoreId: number, aisle: string): Observable<string> {
    return this.connect().pipe(
      mergeMap((success) => this.insertGroceryStoreAisle(groceryStoreId, aisle)),
      map((newAisle) => newAisle)
    );
  }

  public addGroceryStoreSection(groceryStoreId: number, section: string): Observable<string> {
    return this.connect().pipe(
      mergeMap((success) => this.insertGroceryStoreSection(groceryStoreId, section)),
      map((newSection) => newSection)
    );
  }

  private queryGroceryStoreAisles(id: number): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      this.mySqlCommands.queryGroceryStoreAisles(id).then((aisles) => {
        observer.next(aisles);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private queryGroceryStoreSections(id: number): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      this.mySqlCommands.queryGroceryStoreSections(id).then((sections) => {
        observer.next(sections);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private deleteGroceryStoreById(id: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.mySqlCommands.deleteGroceryStore(id).then((rowsAffected) => {
        observer.next(rowsAffected > 0);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private deletePantryItemById(id: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.mySqlCommands.deletePantryItem(id).then((rowsAffected) => {
        observer.next(rowsAffected > 0);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private deleteStoreAisle(id: number, aisle: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.mySqlCommands.deleteGroceryStoreAisle(id, aisle).then((rowsAffected) => {
        observer.next(rowsAffected > 0);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private deleteStoreSection(id: number, section: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.mySqlCommands.deleteGroceryStoreSection(id, section).then((rowsAffected) => {
        observer.next(rowsAffected > 0);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private insertGroceryStore(groceryStoreName: string): Observable<number> {
    return new Observable<number>((observer) => {
      this.mySqlCommands.insertGroceryStore(groceryStoreName).then((rowsAffected) => {
        observer.next(rowsAffected);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private insertGroceryStoreAisle(groceryStoreId: number, aisle: string): Observable<string> {
    return new Observable<string>((observer) => {
      this.mySqlCommands.insertGroceryStoreAisle(groceryStoreId, aisle).then((rowsAffected) => {
        console.log(`${rowsAffected} aisle rows affected`);
        if (rowsAffected > 0) {
          observer.next(aisle);
        }
        observer.complete();
      }).catch((err) => {
        console.log(err);
        return observer.error(err);
      });
    });
  }

  private insertGroceryStoreSection(groceryStoreId: number, section: string): Observable<string> {
    return new Observable<string>((observer) => {
      this.mySqlCommands.insertGroceryStoreSection(groceryStoreId, section).then((rowsAffected) => {
        console.log(`${rowsAffected} aisle rows affected`);
        if (rowsAffected > 0) {
          observer.next(section);
        }
        observer.complete();
      }).catch((err) => {
        console.log(err);
        return observer.error(err);
      });
    });
  }

  private insertPantryItem(pantryItemName: string, description: string): Observable<number> {
    return new Observable<number>((observer) => {
      this.mySqlCommands.insertPantryItem(pantryItemName, description).then((rowsAffected) => {
        observer.next(rowsAffected);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private queryGroceryStoreByName(name: string): Observable<GroceryStore> {
    return new Observable<GroceryStore>((observer) => {
      this.mySqlCommands.queryGroceryStoreByName(name).then((groceryStore) => {
        observer.next(groceryStore);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private queryGroceryStoreById(id: number): Observable<GroceryStore> {
    return new Observable<GroceryStore>((observer) => {
      this.mySqlCommands.queryGroceryStoreById(id).then((groceryStore) => {
        observer.next(groceryStore);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  private queryPantryItemByName(name: string): Observable<PantryItem> {
    return new Observable<PantryItem>((observer) => {
      this.mySqlCommands.queryPantryItemByName(name).then((pantryItem) => {
        observer.next(pantryItem);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  public updatePantryItem(pantryItem: PantryItem): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.mySqlCommands.updatePantryItem(pantryItem).then((result) => {
        observer.next(result);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  public addPantryItemLocation(pantryItemId: number, storeId: number, aisle: string, section: string): Observable<GroceryStoreLocation> {
    return new Observable<GroceryStoreLocation>((observer) => {
      this.mySqlCommands.insertPantryItemLocation(pantryItemId, storeId, aisle, section).then((result) => {
        observer.next(result);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  public updatePantryItemLocation(pantryItemId: number, originalLocationId: number, storeId: number, aisle: string, section: string): Observable<GroceryStoreLocation> {
    return new Observable<GroceryStoreLocation>((observer) => {
      this.mySqlCommands.updatePantryItemLocation(pantryItemId, originalLocationId, storeId, aisle, section).then((result) => {
        observer.next(result);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  public queryGroceryStoreLocationById(id: number): Observable<GroceryStoreLocation> {
    return new Observable<GroceryStoreLocation>((observer) => {
      this.mySqlCommands.queryGroceryStoreLocationById(id).then((groceryStoreLocation) => {
        observer.next(groceryStoreLocation);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  public queryGroceryStoreLocation(storeId: number, aisle: string, section: string): Observable<GroceryStoreLocation> {
    return new Observable<GroceryStoreLocation>((observer) => {
      this.mySqlCommands.queryGroceryStoreLocation(storeId, aisle, section).then((groceryStoreLocation) => {
        observer.next(groceryStoreLocation);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }
  public queryPantryItem(itemId: number): Observable<PantryItem> {
    return new Observable<PantryItem>((observer) => {
      this.mySqlCommands.queryPantryItem(itemId).then((pantryItem) => {
        observer.next(pantryItem);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }
  public queryPantryItemLocation(pantryItemId: number, groceryStoreLocationId: number): Observable<PantryItemLocation> {
    return new Observable<PantryItemLocation>((observer) => {
      this.mySqlCommands.queryPantryItemLocation(pantryItemId, groceryStoreLocationId).then((pantryItemLocation) => {
        observer.next(pantryItemLocation);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }

  public queryPantryItemLocations(pantryItemId: number): Observable<GroceryStoreLocation[]> {
    return new Observable<GroceryStoreLocation[]>((observer) => {
      this.mySqlCommands.queryPantryItemLocations(pantryItemId).then((pantryItemLocations) => {
        observer.next(pantryItemLocations);
        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }
}
