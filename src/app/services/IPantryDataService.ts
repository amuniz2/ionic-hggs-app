import {GroceryStore} from '../modules/store-management/model/grocery-store';
import {Observable} from 'rxjs';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';
import {StoreAisle} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles.component';

export interface IPantryDataService {

  initialize();

  getGroceryStores(): Observable<GroceryStore[]>;

  addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore>;

  deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean>;

  addGroceryStoreAisle(newStoreAisleRequest: StoreAisle): Observable<GroceryStore>;

}
