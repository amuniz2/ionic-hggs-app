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
import {PantryItemLocation} from '../model/PantryItemLocation';
import {GroceryStoreSection} from '../model/grocery-store-section';
import {GroceryStoreAisle} from '../model/grocery-store-aisle';

export interface IPantryDataService {

  initialize();

  addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore>;

  addGroceryStoreAisle(newStoreAisleRequest: StoreAisleOrSection): Observable<string>;

  addGroceryStoreSection(newGroceryStoreSectionRequest: StoreAisleOrSection): Observable<string>;

  addPantryItem(newPantryItemRequest: PantryItem): Observable<PantryItem>;

  addPantryItemLocation(itemId: number, newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation>;

  getGroceryStoreByName(name: string): Observable<GroceryStore>;

  getGroceryStores(): Observable<GroceryStore[]>;

  getPantryItems(): Observable<PantryItem[]>;

  getPantryItemsNeeded(storeId: number): Observable<PantryItem[]>;

  getShoppingList(storeId: number): Observable<ShoppingItem[]>;

  deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean>;

  deletePantryItem(deletePantryItemRequest: DeletePantryItemRequest): Observable<boolean>;

  deletePantryItemLocation(pantryItemId: number, locationId: number): Observable<boolean>;

  getGroceryStoreAisles(groceryStoreId: number): Observable<Set<string>>;

  getGroceryStoreSections(groceryStoreId: number): Observable<Set<string>>;

  deleteGroceryStoreAisle(deleteStoreAisleRequest: StoreAisleOrSection): Observable<boolean>;

  deleteGroceryStoreSection(deleteStoreSectionRequest: StoreAisleOrSection): Observable<boolean>;

  getPantryItem(id: number): Observable<PantryItem>;

  getPantryItemByName(name: string): Observable<PantryItem>;

  getPantryItemLocations(id: number): Observable<GroceryStoreLocation[]>;

  updatePantryItem(savePantryItemRequest: PantryItem): Observable<boolean>;

  updatePantryItemLocation(itemId: number, originalLocationId: number, newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation>;

  getAislesInUse(groceryStoreId: number): Observable<string[]>;

  getSectionsInUse(groceryStoreId: number): Observable<string[]>;

  getGroceryStoreLocations(groceryStoreId: number): Observable<GroceryStoreLocation[]>;

  getAllGroceryStoreLocations(): Observable<GroceryStoreLocation[]>;

  getAllPantryItemLocations(): Observable<PantryItemLocation[]>;

  getAllGroceryStoreAisles(): Observable<GroceryStoreAisle[]>;

  getAllGroceryStoreSections(): Observable<GroceryStoreSection[]>;

  updateGroceryStoreAisle(groceryStoreId: number, oldName: string, newName: string): Observable<boolean>;

  updateShoppingItem(pantryItemId: number, inCart: boolean): Observable<boolean>;
}
