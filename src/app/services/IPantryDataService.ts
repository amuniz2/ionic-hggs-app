import {GroceryStore} from '../model/grocery-store';
import {Observable} from 'rxjs';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';
import {StoreAisle} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import {StoreSection} from '../modules/store-management/dumb-components/grocery-store-sections/grocery-store-sections.component';
import {PantryItem} from '../model/pantry-item';
import {DeletePantryItemRequest} from '../modules/pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {GroceryStoreLocation} from '../model/grocery-store-location';

export interface IPantryDataService {

  initialize();

  addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore>;

  addGroceryStoreAisle(newStoreAisleRequest: StoreAisle): Observable<string>;

  addGroceryStoreSection(newGroceryStoreSectionRequest: StoreSection): Observable<string>;

  addPantryItem(newPantryItemRequest: PantryItem): Observable<PantryItem>;

  addPantryItemLocation(itemId: number, newLocation: GroceryStoreLocation): Observable<number>;

  getGroceryStores(): Observable<GroceryStore[]>;

  getPantryItems(): Observable<PantryItem[]>;

  deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean>;

  deletePantryItem(deletePantryItemRequest: DeletePantryItemRequest): Observable<boolean>;

  getGroceryStoreAisles(groceryStoreId: number): Observable<string[]>;

  getGroceryStoreSections(groceryStoreId: number): Observable<string[]>;

  deleteGroceryStoreAisle(deleteStoreAisleRequest: StoreAisle): Observable<boolean>;

  deleteGroceryStoreSection(deleteStoreSectionRequest: StoreSection): Observable<boolean>;

  updatePantryItem(savePantryItemRequest: PantryItem): Observable<boolean>;
}
