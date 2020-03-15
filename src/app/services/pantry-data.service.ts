import {from, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../model/grocery-store';
// tslint:disable-next-line:max-line-length
import {StoreAisleOrSection} from '../modules/store-management/dumb-components/grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {PantryDbHelper} from './db/db-helper';
import {IPantryDataService} from './IPantryDataService';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';
import {PantryItem} from '../model/pantry-item';
import {DeletePantryItemRequest} from '../modules/pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {GroceryStoreLocation} from '../model/grocery-store-location';
import {ShoppingItem} from '../model/shopping-item';

@Injectable()
export class PantryDataService implements IPantryDataService {
    getAislesInUse(groceryStoreId: number): Observable<string[]> {
        throw new Error("Method not implemented.");
    }
    getSectionsInUse(groceryStoreId: number): Observable<string[]> {
        throw new Error("Method not implemented.");
    }
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

  public addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore> {
    const newStore$ = this.dbHelper.addGroceryStore(newStoreRequest.name);
    return newStore$;
  }
  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisleOrSection): Observable<string> {
    return this.dbHelper.addGroceryStoreAisle(newStoreAisleRequest.groceryStoreId, newStoreAisleRequest.name);
  }

  public addGroceryStoreSection(newGroceryStoreSectionRequest: StoreAisleOrSection): Observable<string> {
    return this.dbHelper.addGroceryStoreSection(newGroceryStoreSectionRequest.groceryStoreId, newGroceryStoreSectionRequest.name);
  }

  public addPantryItem(newPantryItemRequest: PantryItem): Observable<PantryItem> {
    const newPantryItem$ = this.dbHelper.addPantryItem(newPantryItemRequest.name, newPantryItemRequest.description);
    return newPantryItem$;
  }

  public getGroceryStores(): Observable<GroceryStore[]> {
    return this.dbHelper.getAllGroceryStores();
  }

  public getPantryItems(): Observable<PantryItem[]> {
    return this.dbHelper.getAllPantryItems();
  }

  public getGroceryStoreAisles(groceryStoreId: number): Observable<string[]> {
    console.log('Calling dbHelper.getGroceryStoreAisles()');
    return this.dbHelper.getGroceryStoreAisles(groceryStoreId);
  }

  public getGroceryStoreSections(groceryStoreId: number): Observable<string[]> {
    console.log('Calling dbHelper.getGroceryStoreSections()');
    return this.dbHelper.getGroceryStoreSections(groceryStoreId);
  }

  public deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean> {
    return this.dbHelper.deleteGroceryStore(deleteStoreRequest.id);
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

  public updatePantryItem(savePantryItemRequest: PantryItem): Observable<boolean> {
    return this.dbHelper.updatePantryItem(savePantryItemRequest);
  }

  public addPantryItemLocation(itemId: number, newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation> {

    // const storeLocation = this.dbHelper.queryGroceryStoreLocation(newLocation.storeId, newLocation.aisle, newLocation.section);
    // if (storeLocation === null) {
    //   this.dbHelper.addGroceryStoreLocation(newLocation);
    // }

    return this.dbHelper.addPantryItemLocation(itemId, newLocation.storeId, newLocation.aisle, newLocation.section);
  }

  public updatePantryItemLocation(itemId: number,
                                  originalLocationId: number,
                                  newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation> {
    return this.dbHelper.updatePantryItemLocation(itemId, originalLocationId, newLocation.storeId, newLocation.aisle, newLocation.section);
  }
  public getPantryItem(id: number): Observable<PantryItem> {
    return this.dbHelper.queryPantryItem(id);
  }
  public getPantryItemLocations(id: number): Observable<GroceryStoreLocation[]> {
    return this.dbHelper.queryPantryItemLocations(id);
  }

  getPantryItemsNeeded(storeId: number): Observable<PantryItem[]> {
    return undefined;
  }

  getShoppingList(storeId: number): Observable<ShoppingItem[]> {
    return undefined;
  }

  // getPantryItemDetails(id: number): Observable<PantryItem> {
  //   const pantryItem = this.dbHelper.queryPantryItem(id);
  //   if (pantryItem != null) {
  //     pantryItem.locations = this.dbHelper.queryPantryItemLocations(id);
  //   }
  // }
}
