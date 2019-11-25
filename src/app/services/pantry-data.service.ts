import {from, Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../model/grocery-store';
import {StoreAisle} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import {PantryDbHelper} from './db/db-helper';
import {IPantryDataService} from './IPantryDataService';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';
import {StoreSection} from '../modules/store-management/dumb-components/grocery-store-sections/grocery-store-sections.component';
import {PantryItem} from '../model/pantry-item';
import {DeletePantryItemRequest} from '../modules/pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';

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

  public addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore> {
    const newStore$ = this.dbHelper.addGroceryStore(newStoreRequest.name);
    return newStore$;
  }
  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisle): Observable<string> {
    return this.dbHelper.addGroceryStoreAisle(newStoreAisleRequest.groceryStoreId, newStoreAisleRequest.aisle);
  }

  public addGroceryStoreSection(newGroceryStoreSectionRequest: StoreSection): Observable<string> {
    return this.dbHelper.addGroceryStoreSection(newGroceryStoreSectionRequest.groceryStoreId, newGroceryStoreSectionRequest.section);
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

  public deleteGroceryStoreAisle(deleteStoreAisleRequest: StoreAisle): Observable<boolean> {
    return this.dbHelper.deleteGroceryStoreAisle(deleteStoreAisleRequest.groceryStoreId, deleteStoreAisleRequest.aisle);
  }
  public deleteGroceryStoreSection(deleteStoreSectionRequest: StoreSection): Observable<boolean> {
    return this.dbHelper.deleteGroceryStoreSection(deleteStoreSectionRequest.groceryStoreId, deleteStoreSectionRequest.section);
  }

  public deletePantryItem(deletePantryItemRequest: DeletePantryItemRequest): Observable<boolean> {
    return this.dbHelper.deletePantryItem(deletePantryItemRequest.id);
  }

  public updatePantryItem(savePantryItemRequest: PantryItem): Observable<boolean> {
    return this.dbHelper.updatePantryItem(savePantryItemRequest);
  }
}
