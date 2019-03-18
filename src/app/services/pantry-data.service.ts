import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../modules/store-management/model/grocery-store';
import {StoreAisle} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles.component';

@Injectable()
export class PantryDataService {
  private readonly groceryStores: GroceryStore[];
  constructor() {
    this.groceryStores = [
      { id: 1, name: 'Publix', aisles: [], locations: [], sections: []},
      { id: 2, name: 'Target', aisles: [], locations: [], sections: []},
    ];
  }

  public getGroceryStores(): Observable<GroceryStore[]> {
    return of(this.groceryStores);
  }

  public addGroceryStore(newStoreRequest: any): Observable<GroceryStore> {
    const newStore: GroceryStore = {
      name: newStoreRequest.createGroceryStorePayload.name,
      sections: [],
      locations: [],
      aisles: [],
      id: this.groceryStores.length + 1
    };
    this.groceryStores.push(newStore);
    return of(newStore);
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
