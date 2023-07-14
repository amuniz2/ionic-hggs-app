import {Observable, of, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../model/grocery-store';
import {IPantryDataService} from './IPantryDataService';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';
import {ShoppingItem} from '../model/shopping-item';
import {PantryItem} from '../model/pantry-item';
import {DeletePantryItemRequest} from '../modules/pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {GroceryStoreLocation} from '../model/grocery-store-location';
import {PantryItemLocation} from '../model/PantryItemLocation';
// tslint:disable-next-line:max-line-length
import {StoreAisleOrSection} from '../modules/store-management/dumb-components/grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {GroceryStoreAisle} from '../model/grocery-store-aisle';
import {GroceryStoreSection} from '../model/grocery-store-section';
import {HggsData} from '../model/hggs-data';
import {FakePantryDataServiceHelper} from './fake-pantry-data-service-helper';

@Injectable()
export class FakePantryDataService implements IPantryDataService {

//    private readonly shoppingItems: ShoppingItem[];

    constructor(private helper: FakePantryDataServiceHelper){}
  selectDefaulPantrytItems(setNeed: boolean): Observable<PantryItem[]> {
    throw new Error('Method not implemented.');
  }

  updateGroceryStoreSection(groceryStoreId: number, oldName: string, newName: string): Observable<boolean> {
        throw new Error("Method not implemented.");
    }
    getPantryItemsNeeded(storeId: number): Observable<PantryItem[]> {
        throw new Error('Method not implemented.');
    }

  deleteGroceryStoreAisle(deleteStoreAisleRequest: StoreAisleOrSection): Observable<boolean> {
    return of(this.helper.deleteGroceryStoreAisle(deleteStoreAisleRequest));
  }

  public deleteGroceryStoreSection(deleteStoreSectionRequest: StoreAisleOrSection): Observable<boolean> {
    return of(this.helper.deleteGroceryStoreSection(deleteStoreSectionRequest));
  }

  public initialize(): Observable<boolean> {
    return of(true);
  }

  public getGroceryStores(): Observable<GroceryStore[]> {
    return of(this.helper.getAllGroceryStores());
  }

  public addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore> {
    return of(this.helper.addGroceryStore(newStoreRequest));
  }

  private addNewGroceryStore(newStoreRequest: NewGroceryStoreRequest): GroceryStore {
    return this.helper.addNewGroceryStore(newStoreRequest);
  }

  public deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean> {
    return of(this.helper.deleteGroceryStore(deleteStoreRequest));
  }

  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisleOrSection): Observable<string> {
      return of(this.helper.addGroceryStoreAisle(newStoreAisleRequest));
  }

  addGroceryStoreSection(newGroceryStoreSectionRequest: StoreAisleOrSection): Observable<string> {
    return of(this.helper.addGroceryStoreSection(newGroceryStoreSectionRequest));
  }

  getGroceryStoreAisles(groceryStoreId: number): Observable<Set<string>> {
    const groceryStore = this.helper.findGroceryStore(groceryStoreId);
    if (groceryStore === null) {
      return of(new Set<string>());
    }
    return of(groceryStore.aisles);
  }

  getGroceryStoreSections(groceryStoreId: number): Observable<Set<string>> {
    const groceryStore = this.helper.findGroceryStore(groceryStoreId);
    if (groceryStore === null) {
      return of(new Set<string>());
    }
    return of(groceryStore.sections);
  }

  getPantryItems(): Observable<PantryItem[]> {
    return of(this.helper.getPantryItems());
  }

  addPantryItem(newPantryItemRequest: PantryItem): Observable<PantryItem> {
    return of( this.helper.addPantryItem(newPantryItemRequest));
  }

  deletePantryItem(deletePantryItemRequest: DeletePantryItemRequest): Observable<boolean> {
    return of(this.helper.deletePantryItem(deletePantryItemRequest));
  }

  updatePantryItem(savePantryItemRequest: PantryItem): Observable<PantryItem> {
    const pantryItemToUpdate = this.helper.findPantryItem(savePantryItemRequest.id);
    pantryItemToUpdate.description = savePantryItemRequest.description;
    pantryItemToUpdate.name = savePantryItemRequest.name;
    pantryItemToUpdate.need = savePantryItemRequest.need;
    pantryItemToUpdate.defaultQuantity = savePantryItemRequest.defaultQuantity;
    pantryItemToUpdate.quantityNeeded = savePantryItemRequest.quantityNeeded;
    pantryItemToUpdate.inCart = savePantryItemRequest.inCart;
    pantryItemToUpdate.units = savePantryItemRequest.units;
    return of(pantryItemToUpdate);
  }

  addPantryItemLocation(itemId: number, storeLocationId: number): Observable<boolean> {
    return of(this.helper.addPantryItemLocation(itemId, storeLocationId));
  }

  addNewPantryItemLocation(itemId: number, newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation> {
    return of(this.helper.addNewPantryItemLocation(itemId, newLocation));
  }

  updatePantryItemLocation(itemId: number,
                           originalLocationId: number,
                           newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation> {
    return of(this.helper.updatePantryItemLocation(itemId, originalLocationId, newLocation));
  }

  public getPantryItem(id: number): Observable<PantryItem> {
    return of({ ...this.helper.findPantryItem(id)});
  }

  public getPantryItemLocations(id: number): Observable<GroceryStoreLocation[]> {
    return of(this.helper.getPantryItemLocations(id));
  }

  getShoppingList(storeId: number): Observable<ShoppingItem[]> {
    return of(this.helper.getShoppingList(storeId));
  }


  getSectionsInUse(groceryStoreId: number): Observable<string[]> {
    return of(this.helper.findItemsInUse(groceryStoreId, 'aisle'));
  }

  getGroceryStoreLocations(groceryStoreId: number): Observable<GroceryStoreLocation[]> {
    return  of(this.helper.findGroceryStoreLocations(groceryStoreId));
  }

  updateGroceryStoreAisle(groceryStoreId: number, oldName: string, newName: string): Observable<boolean> {
    return of(this.helper.updateGroceryStoreAisle(groceryStoreId, oldName, newName));
  }

  updateShoppingItem(storeId: number, pantryItemId: number, inCart: boolean): Observable<ShoppingItem> {
    const pantryItemToUpdate = this.helper.findPantryItem(pantryItemId);
    const pantryItemLocation = this.helper.findPantryItemLocation(pantryItemId, storeId);
    pantryItemToUpdate.need = !inCart;
    pantryItemToUpdate.inCart = inCart;
    return of({
      ...pantryItemToUpdate,
      quantity: pantryItemToUpdate.quantityNeeded,
      pantryItemId,
      storeId,
      location: {
        locationId: pantryItemLocation.id,
        aisle: pantryItemLocation.aisle,
        section: pantryItemLocation.section
      }
    });
    }

  getAllGroceryStoreLocations(): Observable<GroceryStoreLocation[]> {
    return of(this.helper.getAllGroceryStoreLocations());
  }

  getAllPantryItemLocations(): Observable<PantryItemLocation[]> {
    return of(this.helper.getAllPantryItemLocations());
  }

  getAislesInUse(groceryStoreId: number): Observable<string[]> {
    return of(this.helper.getAislesInUse(groceryStoreId));
  }

  deletePantryItemLocation(pantryItemId: number, locationId: number): Observable<boolean> {
    return of(this.helper.deletePantryItemLocation(pantryItemId, locationId));
  }

  getAllGroceryStoreAisles(): Observable<GroceryStoreAisle[]> {
      return of(this.helper.getAllGroceryStoreAisles());
  }

  getAllGroceryStoreSections(): Observable<GroceryStoreSection[]> {
    return of(this.helper.getAllGroceryStoreSections());
  }

  getGroceryStoreByName(name: string): Observable<GroceryStore> {
    return of(this.helper.getGroceryStoreByName(name));
  }

  getPantryItemByName(name: string): Observable<PantryItem> {
    return of(this.helper.getPantryItemByName(name));
  }

  importHggsData(data: HggsData): Observable<boolean> {
      return of(this.helper.importHggsData(data));
  }

  isPantryItemNeeded(itemId: number): Observable<boolean> {
      const pantryItem = this.helper.findPantryItem(itemId);
    return of(pantryItem.need);
  }

  cleanupLocations(): Observable<boolean> {
    return undefined;
  }

  addShoppingItemInLocation(newPantryItemRequest: PantryItem, locationId: number): Observable<PantryItem> {
    return undefined;
  }

  addShoppingItemInNewLocation(newPantryItemRequest: PantryItem, storeLocation: GroceryStoreLocation): Observable<ShoppingItem> {
    return of(this.helper.addNewShoppingItemInNewLocation(newPantryItemRequest, storeLocation));
  }

  addDefaultItemsToNeededList(markAsNeedd: boolean): Observable<boolean> {
    return undefined;
  }
}
