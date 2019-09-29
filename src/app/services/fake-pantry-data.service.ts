import {from, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../modules/store-management/model/grocery-store';
import {StoreAisle} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import {IPantryDataService} from './IPantryDataService';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';

@Injectable()
export class FakePantryDataService implements IPantryDataService {
  private readonly groceryStores: GroceryStore[];
  constructor() {
    this.groceryStores = [
      { id: 1, name: 'Publix', aisles: [], locations: [], sections: []},
      { id: 2, name: 'Target', aisles: [], locations: [], sections: []},
    ];
  }

  public initialize(): Observable<boolean> {
    return of(true);
  }
  public getGroceryStores(): Observable<GroceryStore[]> {
    console.log('Calling dbHelper.getAllGroceryStores()');
    return of(this.groceryStores);
  }

  public addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore> {
    console.log(`adding: ${JSON.stringify(newStoreRequest)}`);
    const newStore: GroceryStore = {
      aisles: [],
      id: this.groceryStores.length + 1,
      sections: [],
      locations: [],
      name: newStoreRequest.name
    };
    this.groceryStores.push(newStore);
    return of(newStore);
  }

  public deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean> {
    let i: number;
    let groceryStoreDeleted: GroceryStore;
    for (i = 0; i < this.groceryStores.length; i++) {
      if (this.groceryStores[i].id === deleteStoreRequest.id) {
        groceryStoreDeleted = this.groceryStores[i];
        break;
      }
    }
    this.groceryStores.splice(i, 1);
    return of(true);
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
