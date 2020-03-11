import {GroceryStore} from '../model/grocery-store';
import {Observable} from 'rxjs';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';
// tslint:disable-next-line:max-line-length
import {StoreAisleOrSection} from '../modules/store-management/dumb-components/grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {PantryItem} from '../model/pantry-item';
import {ShoppingItem} from '../model/shopping-item';
import {DeletePantryItemRequest} from '../modules/pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {GroceryStoreLocation} from '../model/grocery-store-location';

export interface IPantryDataService {

  initialize();

  addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore>;

  addGroceryStoreAisle(newStoreAisleRequest: StoreAisleOrSection): Observable<string>;

  addGroceryStoreSection(newGroceryStoreSectionRequest: StoreAisleOrSection): Observable<string>;

  addPantryItem(newPantryItemRequest: PantryItem): Observable<PantryItem>;

  addPantryItemLocation(itemId: number, newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation>;

  getGroceryStores(): Observable<GroceryStore[]>;

  getPantryItems(): Observable<PantryItem[]>;

  getPantryItemsNeeded(storeId: number): Observable<PantryItem[]>;

  getShoppingList(storeId: number): Observable<ShoppingItem[]>;

  deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean>;

  deletePantryItem(deletePantryItemRequest: DeletePantryItemRequest): Observable<boolean>;

  getGroceryStoreAisles(groceryStoreId: number): Observable<string[]>;

  getGroceryStoreSections(groceryStoreId: number): Observable<string[]>;

  deleteGroceryStoreAisle(deleteStoreAisleRequest: StoreAisleOrSection): Observable<boolean>;

  deleteGroceryStoreSection(deleteStoreSectionRequest: StoreAisleOrSection): Observable<boolean>;

  getPantryItem(id: number): Observable<PantryItem>;

  getPantryItemLocations(id: number): Observable<GroceryStoreLocation[]>;

  updatePantryItem(savePantryItemRequest: PantryItem): Observable<boolean>;

  updatePantryItemLocation(itemId: number, originalLocationId: number, newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation>;
}
