import {from, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../modules/store-management/model/grocery-store';
import {StoreAisle} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import {PantryDbHelper} from './db-helper';
import {IPantryDataService} from './IPantryDataService';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';

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
    return this.dbHelper.connect();
  }
  public getGroceryStores(): Observable<GroceryStore[]> {
    console.log('Calling dbHelper.getAllGroceryStores()');
    return this.dbHelper.getAllGroceryStores();
  }

  public addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore> {
    console.log(`adding: ${JSON.stringify(newStoreRequest)}`);
    const newStore$ = this.dbHelper.addGroceryStore(newStoreRequest.name);
    // this.groceryStores.push(newStore);
    return newStore$;
  }

  public deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean> {
    return this.dbHelper.deleteGroceryStore(deleteStoreRequest.id);
  }

  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisle): Observable<GroceryStore> {
    return this.dbHelper.addGroceryStoreAisle(newStoreAisleRequest.groceryStoreId, newStoreAisleRequest.aisle);
    // let i: number;
    // let groceryStore: GroceryStore;
    // for (i = 0; i < this.groceryStores.length; i++) {
    //   if (this.groceryStores[i].id === newStoreAisleRequest.groceryStoreId) {
    //     groceryStore = this.groceryStores[i];
    //     break;
    //   }
    // }
    // groceryStore.aisles.push(newStoreAisleRequest.aisle);
    // return of(groceryStore);
  }
}
