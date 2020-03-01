import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroceryStore} from '../model/grocery-store';
// tslint:disable-next-line:max-line-length
import {StoreAisleOrSection} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles-or-sections.component';
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

@Injectable()
export class FakePantryDataService implements IPantryDataService {
  constructor() {
    this.groceryStores = [
      { id: 1, name: 'Publix', aisles: [], locations: [], sections: []},
      { id: 2, name: 'Target', aisles: [], locations: [], sections: []},
    ];
    this.pantryItems = [
      { id: 1,
        name: 'Whole Wheat Bread',
        defaultQuantity: 1,
        units: 'loaf',
        description: 'Holsum',
        locations: [],
        need: false,
        quantityNeeded: 1},
    ];
    this.shoppingItems = [];
    this.pantryItemLocations = [];
    this.groceryStoreLocations = [];
  }
  private readonly groceryStores: GroceryStore[];
  private readonly pantryItems: PantryItem[];
  private readonly pantryItemLocations: PantryItemLocation[];
  private readonly groceryStoreLocations: GroceryStoreLocation[];
  private readonly shoppingItems: ShoppingItem[];
    getPantryItemsNeeded(storeId: number): Observable<PantryItem[]> {
        throw new Error('Method not implemented.');
    }

  deleteGroceryStoreAisle(deleteStoreAisleRequest: StoreAisleOrSection): Observable<boolean> {
      throw new Error('Method not implemented.');
  }
  deleteGroceryStoreSection = (deleteStoreSectionRequest: StoreAisleOrSection): Observable<boolean> => {
      throw new Error('Method not implemented.');
  }

  public initialize(): Observable<boolean> {
    return of(true);
  }
  public getGroceryStores(): Observable<GroceryStore[]> {
    console.log('Calling dbHelper.getAllGroceryStores()');
    const ret: GroceryStore[] = [];
    this.groceryStores.forEach((groceryStore) => {
      ret.push({ ...groceryStore, aisles: [], sections: [] });
    });
    return of(ret);
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

  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisleOrSection): Observable<string> {
    const groceryStore: GroceryStore = this.groceryStores.find((grocerStore) => grocerStore.id === newStoreAisleRequest.groceryStoreId);
    let aisleAdded = '';
    if (groceryStore != null) {
      groceryStore.aisles.push(newStoreAisleRequest.name);
      aisleAdded = newStoreAisleRequest.name;
    }
    return of(aisleAdded);
  }

  addGroceryStoreSection(newGroceryStoreSectionRequest: StoreAisleOrSection): Observable<string> {
    const groceryStore: GroceryStore = this.groceryStores.find(
      (grocerStore) => grocerStore.id === newGroceryStoreSectionRequest.groceryStoreId);
    let sectionAdded = '';
    if (groceryStore != null) {
      groceryStore.sections.push(newGroceryStoreSectionRequest.name);
      sectionAdded = newGroceryStoreSectionRequest.name;
    }
    return of(sectionAdded);
  }

  getGroceryStoreAisles(groceryStoreId: number): Observable<string[]> {
    console.log('Inside getGroceryStoreAisles()');
    const groceryStore = this.getGroceryStore(groceryStoreId);
    if (groceryStore === null) {
      return of([]);
    }
    return of(groceryStore.aisles);
  }

  getGroceryStoreSections(groceryStoreId: number): Observable<string[]> {
    console.log('Inside getGroceryStoreSections()');
    const groceryStore = this.getGroceryStore(groceryStoreId);
    if (groceryStore === null) {
      return of([]);
    }
    return of(groceryStore.sections);
  }

  getGroceryStore(groceryStoreId: number): GroceryStore {
    let ret = null;
    this.groceryStores.forEach(groceryStore => {
      if (groceryStore.id === groceryStoreId) {
        ret = groceryStore;
      }
    });
    return ret;
  }

  getPantryItems(): Observable<PantryItem[]> {
    return of(this.pantryItems);
  }

  addPantryItem(newPantryItemRequest: PantryItem): Observable<PantryItem> {
    const newPantryItem = { ...newPantryItemRequest, id: this.pantryItems.length + 1};
    this.pantryItems.push(newPantryItem);
    return of(newPantryItem);
  }

  deletePantryItem(deletePantryItemRequest: DeletePantryItemRequest): Observable<boolean> {
    return undefined;
  }

  updatePantryItem(savePantryItemRequest: PantryItem): Observable<boolean> {
    const pantryItemToUpdate = this.findPantryItem(savePantryItemRequest.id);
    pantryItemToUpdate.description = savePantryItemRequest.description;
    pantryItemToUpdate.name = savePantryItemRequest.name;
    pantryItemToUpdate.need = savePantryItemRequest.need;
    pantryItemToUpdate.defaultQuantity = savePantryItemRequest.defaultQuantity;
    pantryItemToUpdate.units = savePantryItemRequest.units;
    return of(true);
  }

  addPantryItemLocation(itemId: number, newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation> {
    let groceryStoreLocation = this.findGroceryStoreLocation(
      newLocation.storeId,
      newLocation.aisle,
      newLocation.section
    );
    if (groceryStoreLocation == null) {
      groceryStoreLocation = {
        ...newLocation,
        storeName: this.findGroceryStore(newLocation.storeId).name,
        id: this.groceryStoreLocations.length + 1
      };
      this.groceryStoreLocations.push(groceryStoreLocation);
    }
    this.pantryItemLocations.push({
      pantryItemId: itemId,
      groceryStoreLocationId: groceryStoreLocation.id
    });

    return of(groceryStoreLocation);
  }

  updatePantryItemLocation(itemId: number,
                           originalLocationId: number,
                           newLocation: GroceryStoreLocation): Observable<GroceryStoreLocation> {
    let groceryStoreLocation = this.findGroceryStoreLocation(
      newLocation.storeId,
      newLocation.aisle,
      newLocation.section
    );
    if (groceryStoreLocation == null) {
      groceryStoreLocation = {
        ...newLocation,
        storeName: this.findGroceryStore(newLocation.storeId).name,
        id: this.groceryStoreLocations.length + 1
      };
      this.groceryStoreLocations.push(groceryStoreLocation);
    }

    const index = this.pantryItemLocations.findIndex(x => x.pantryItemId === itemId && x.groceryStoreLocationId === originalLocationId);

    if (index !== -1) {
      this.pantryItemLocations[index].groceryStoreLocationId = groceryStoreLocation.id;
    }

    return of(groceryStoreLocation);
  }

  public getPantryItem(id: number): Observable<PantryItem> {
    return of(this.findPantryItem(id));
  }
  public getPantryItemLocations(id: number): Observable<GroceryStoreLocation[]> {
    const pantryItemLocations: PantryItemLocation[] =  this.pantryItemLocations.filter(location => location.pantryItemId === id);
    const result = [];
    pantryItemLocations.forEach( pantryItemLoc => {
      result.push(this.groceryStoreLocations.find(x => x.id === pantryItemLoc.groceryStoreLocationId));
    });
    return of(result);
  }

  findPantryItem(id: number): PantryItem {
    return  this.pantryItems.find(pantryItem => pantryItem.id === id);
  }

  findGroceryStoreLocation(storeId: number, aisle: string, section: string): GroceryStoreLocation {
    return this.groceryStoreLocations.find(loc => (loc.storeId === storeId) && (loc.aisle === aisle) && (loc.section === section));
  }

  findPantryItemLocation(pantryItemId: number, groceryLocationId: number): PantryItemLocation {
    return this.pantryItemLocations.find(loc => (loc.pantryItemId === pantryItemId) && (loc.groceryStoreLocationId === groceryLocationId));
  }

  findGroceryStore(id: number): GroceryStore {
    return this.groceryStores.find(store => store.id === id);
  }

  private getPantryItemsNeededInternal(storeId: number, shoppingItems: ShoppingItem[]): PantryItem[] {
    return this.pantryItems.filter((item) => {
      if (!item.need) {
        return false;
      }
      const itemFoundInStore =
      !!this.pantryItemLocations.find((ploc) => ploc.pantryItemId === item.id &&
        !!this.groceryStoreLocations.find((gloc) => gloc.id === ploc.groceryStoreLocationId && gloc.storeId === storeId));

      if (!itemFoundInStore) {
        return false;
      }
      return !shoppingItems.find((shoppingItem => shoppingItem.pantryItemId === item.id));
    });
  }

  getShoppingList(storeId: number): Observable<ShoppingItem[]> {
    // remove items in shoppingList already purchased / loaded into cart
    const shoppingItemsStillNeeded = this.shoppingItems.filter(shoppingItem => !shoppingItem.inCart);
    const additionalShoppingItemsNeeded: ShoppingItem[] =
      this.getPantryItemsNeededInternal(storeId, shoppingItemsStillNeeded).map((pantryItem: PantryItem) => {
      const pantryItemLocation = this.pantryItemLocations.find(ploc => ploc.pantryItemId === pantryItem.id);
      const groceryStoreLocation = this.groceryStoreLocations.find(gloc => gloc.id === pantryItemLocation.groceryStoreLocationId);
      return {
        pantryItem,
        pantryItemId: pantryItem.id,
        locationId: groceryStoreLocation.id,
        location: groceryStoreLocation,
        inCart: false,
        quantity: pantryItem.defaultQuantity,
      };
    });
    shoppingItemsStillNeeded.push(...additionalShoppingItemsNeeded);
    return of(shoppingItemsStillNeeded);
  }
}
