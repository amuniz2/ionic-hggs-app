import {from, Observable, of, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../model/grocery-store';
// tslint:disable-next-line:max-line-length
import {StoreAisleOrSection} from '../modules/store-management/dumb-components/grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {GroceryStoreComponentTypes, PantryDbHelper} from './db/db-helper';
import {IPantryDataService, UpdatePantryItemResult} from './IPantryDataService';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';
import {PantryItem} from '../model/pantry-item';
import {DeletePantryItemRequest} from '../modules/pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {GroceryStoreLocation} from '../model/grocery-store-location';
import {ShoppingItem} from '../model/shopping-item';
import {PantryItemLocation} from '../model/PantryItemLocation';
import {GroceryStoreAisle} from '../model/grocery-store-aisle';
import {GroceryStoreSection} from '../model/grocery-store-section';
import {HggsData} from '../model/hggs-data';

@Injectable()
export class PantryDataService implements IPantryDataService {
  constructor(private dbHelper: PantryDbHelper) {
  }
 
  selectDefaulPantrytItems(setNeed: boolean): Observable<PantryItem[]> {
    return this.dbHelper.setNeedForRecurringItems(setNeed);
  }


  cleanupLocations(): Observable<boolean> {
    try {
      return this.dbHelper.cleanupLocations();
    } catch(error) {
      return throwError(error);
    }
  }

  public initialize(): Observable<boolean> {
    return this.dbHelper.connect();
  }

  getGroceryStoreLocations(groceryStoreId: number): Observable<GroceryStoreLocation[]> {
      return this.dbHelper.getGroceryStoreLocations(groceryStoreId);
  }

  getAislesInUse(groceryStoreId: number): Observable<string[]> {
      return this.dbHelper.getGroceryStoreAislesInUse(groceryStoreId);
  }

  getSectionsInUse(groceryStoreId: number): Observable<string[]> {
    return this.dbHelper.getGroceryStoreSectionsInUse(groceryStoreId);
  }

  public addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore> {
    const newStore$ = this.dbHelper.addGroceryStore(newStoreRequest.name);
    return newStore$;
  }

  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisleOrSection): Observable<string> {
    try {
      return this.dbHelper.addGroceryStoreAisle(newStoreAisleRequest.groceryStoreId, newStoreAisleRequest.name);
    } catch(error) {
      return throwError(error);
    }
  }

  public addGroceryStoreSection(newGroceryStoreSectionRequest: StoreAisleOrSection): Observable<string> {
    try {
      return this.dbHelper.addGroceryStoreSection(newGroceryStoreSectionRequest.groceryStoreId, newGroceryStoreSectionRequest.name);
    } catch(error) {
      return throwError(error);
    }
  }

  public addPantryItem(newPantryItemRequest: PantryItem): Observable<PantryItem> {
   const { name, description, units, quantityNeeded, defaultQuantity, need, selectByDefault } = newPantryItemRequest;
    const newPantryItem$ = this.dbHelper.addPantryItem(name, description, units, quantityNeeded, defaultQuantity, need, selectByDefault);
    return newPantryItem$;
  }


  public addPantryItemInLocation(newPantryItemRequest: PantryItem, storeLocation: GroceryStoreLocation): Observable<PantryItem> {
    const { name, description, units, quantityNeeded, defaultQuantity, need, selectByDefault } = newPantryItemRequest;
    const newPantryItem$ = this.dbHelper.addPantryItem(name, description, units, quantityNeeded, defaultQuantity, need, selectByDefault);
    return newPantryItem$;
  }

  public getGroceryStoreByName(name: string): Observable<GroceryStore> {
    return this.dbHelper.getGroceryStoreByName(name);
  }

  public getGroceryStores(): Observable<GroceryStore[]> {
    return this.dbHelper.getAllGroceryStores();
  }

  public getPantryItems(): Observable<PantryItem[]> {
    return this.dbHelper.getAllPantryItems();
  }

  public getGroceryStoreAisles(groceryStoreId: number): Observable<Set<string>> {
    return this.dbHelper.getGroceryStoreAisles(groceryStoreId);
  }

  public getGroceryStoreSections(groceryStoreId: number): Observable<Set<string>> {
    return this.dbHelper.getGroceryStoreSections(groceryStoreId);
  }

  public deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean> {
    console.log('Calling dbHelper.deletegroceryStore');
    try {
      return this.dbHelper.deleteGroceryStore(deleteStoreRequest.id);
    } catch(error) {
      console.log('error occurred when calling dbHelper.deleteGroceryStore', error);
      throwError(error);
    }
  }

  public deleteGroceryStoreAisle(deleteStoreAisleRequest: StoreAisleOrSection): Observable<boolean> {
    return this.dbHelper.deleteGroceryStoreAisle(deleteStoreAisleRequest.groceryStoreId, deleteStoreAisleRequest.name);
  }
  public deleteGroceryStoreSection(deleteStoreSectionRequest: StoreAisleOrSection): Observable<boolean> {
    return this.dbHelper.deleteGroceryStoreSection(deleteStoreSectionRequest.groceryStoreId, deleteStoreSectionRequest.name);
  }

  public deletePantryItem(deletePantryItemRequest: DeletePantryItemRequest): Observable<boolean> {
    return this.dbHelper.deletePantryItem(deletePantryItemRequest.id);
  }

  public deletePantryItemLocation(pantryItemId: number, locationId: number): Observable<boolean> {
    return this.dbHelper.deletePantryItemLocation(pantryItemId, locationId);
  }

  public updatePantryItem(savePantryItemRequest: PantryItem): Observable<PantryItem> {
    return this.dbHelper.updatePantryItem(savePantryItemRequest)
  }

  public addNewPantryItemLocation(itemId: number, newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation> {
    return this.dbHelper.addNewPantryItemLocation(itemId, newLocation.storeId, newLocation.aisle, newLocation.section);
  }

  public addPantryItemLocation(itemId: number, locationId:number): Observable<boolean> {
    return this.dbHelper.addPantryItemLocation(itemId, locationId);
  }

  public updatePantryItemLocation(itemId: number,
                                  originalLocationId: number,
                                  newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation> {
    return this.dbHelper.updatePantryItemLocation(itemId, originalLocationId, newLocation.storeId, newLocation.aisle, newLocation.section);
  }
  public getPantryItem(id: number): Observable<PantryItem> {
    return this.dbHelper.queryPantryItem(id);
  }

  public getPantryItemByName(name: string): Observable<PantryItem> {
    return this.dbHelper.queryPantryItemByName(name);
  }

  public getPantryItemLocations(id: number): Observable<GroceryStoreLocation[]> {
    return this.dbHelper.queryPantryItemLocations(id);
  }

  getPantryItemsNeeded(storeId: number): Observable<PantryItem[]> {
    return undefined;
  }

  getShoppingList(storeId: number): Observable<ShoppingItem[]> {
    return this.dbHelper.queryShoppingItems(storeId);
  }

  updateGroceryStoreAisle(groceryStoreId: number, oldName: string, newName: string): Observable<boolean> {
    console.log('in service to update aisle name.');
    return this.dbHelper.updateGroceryStoreComponentName(
      GroceryStoreComponentTypes.Aisle,
      groceryStoreId,
      oldName,
      newName);
  }

  updateGroceryStoreSection(groceryStoreId: number, oldName: string, newName: string): Observable<boolean> {
    console.log('in service to update section name.');
    return this.dbHelper.updateGroceryStoreComponentName(
      GroceryStoreComponentTypes.Section,
      groceryStoreId,
      oldName,
      newName);
  }

  updateShoppingItem(storeId: number, pantryItemId: number, inCart: boolean): Observable<ShoppingItem> {
    return this.dbHelper.updateShoppingItem(storeId, pantryItemId, inCart);
  }

  getAllGroceryStoreLocations(): Observable<GroceryStoreLocation[]> {
    return this.dbHelper.getAllGroceryStoreLocations();
  }

  getAllPantryItemLocations(): Observable<PantryItemLocation[]> {
    return this.dbHelper.getAllPantryItemLocations();
  }

  getAllGroceryStoreAisles(): Observable<GroceryStoreAisle[]> {
    return this.dbHelper.getAllGroceryStoreAisles();
  }

  getAllGroceryStoreSections(): Observable<GroceryStoreSection[]> {
    return this.dbHelper.getAllGroceryStoreSections();
  }

  isPantryItemNeeded(itemId: number): Observable<boolean> {
    return this.dbHelper.isPantryItemNeeded(itemId);
  }

  importHggsData(data: HggsData): Observable<boolean> {
    return this.dbHelper.importHggsData(data);
  }

  addShoppingItemInLocation(newPantryItemRequest: PantryItem, locationId: number): Observable<PantryItem> {
    return undefined;
  }

  addShoppingItemInNewLocation(newPantryItemRequest: PantryItem, storeLocation: GroceryStoreLocation): Observable<ShoppingItem> {
    console.log('calling this.dbHelper.addShoppingItemInNewLocation');
    return this.dbHelper.addShoppingItemInNewLocation(newPantryItemRequest, storeLocation);
  }
}
