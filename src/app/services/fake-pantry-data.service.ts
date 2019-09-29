import {from, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../modules/store-management/model/grocery-store';
import {StoreAisle} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import {PantryDbHelper} from './db-helper';
import {IPantryDataService} from './IPantryDataService';

@Injectable()
export class PantryDataService implements IPantryDataService {
  private readonly groceryStores: GroceryStore[];
  constructor(private dbHelper: PantryDbHelper) {
    this.groceryStores = [
      { id: 1, name: 'Publix', aisles: [], locations: [], sections: []},
      { id: 2, name: 'Target', aisles: [], locations: [], sections: []},
    ];
  }

  public initialize(): Observable<boolean> {
    return from(this.dbHelper.openOrCreateDb());
  }
  public getGroceryStores(): Observable<GroceryStore[]> {
    console.log('Calling dbHelper.getAllGroceryStores()');
    return this.dbHelper.getAllGroceryStores();
  }

  public addGroceryStore(newStoreRequest: any): Observable<GroceryStore> {
    console.log(`adding: ${JSON.stringify(newStoreRequest)}`);
    const newStore$ = this.dbHelper.addGroceryStore(newStoreRequest.createGroceryStorePayload.name);
    // this.groceryStores.push(newStore);
    return newStore$;
  }

  public deleteGroceryStore(deleteStoreRequest: any): Observable<GroceryStore> {
    let i: number;
    let groceryStoreDeleted: GroceryStore;
    for (i = 0; i < this.groceryStores.length; i++) {
      if (this.groceryStores[i].id === deleteStoreRequest.deleteGroceryStorePayload.id) {
        groceryStoreDeleted = this.groceryStores[i];
        break;
      }
    }
    this.groceryStores.splice(i, 1);
    return of(groceryStoreDeleted);
  }

  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisle): Observable<GroceryStore> {
    let i: number;
    let groceryStore: GroceryStore;
    for (i = 0; i < this.groceryStores.length; i++) {
      if (this.groceryStores[i].id === newStoreAisleRequest.groceryStoreId) {
        groceryStore = this.groceryStores[i];
        break;
      }
    }
    groceryStore.aisles.push(newStoreAisleRequest.aisle);
    return of(groceryStore);
  }
}
