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

@Injectable()
export class FakePantryDataService implements IPantryDataService {
  constructor() {
    this.groceryStores = [
      { id: 1, name: 'XPublix', aisles: new Set<string>(), locations: [], sections: new Set<string>()},
      { id: 2, name: 'Target', aisles: new Set<string>(), locations: [], sections: new Set<string>()},
    ];
    this.pantryItems = [
      { id: 1,
        name: 'Whole Wheat Bread',
        defaultQuantity: 1,
        units: 'loaf',
        description: 'Holsum',
        locations: [],
        need: false,
        quantityNeeded: 1,
        inCart: false
      },
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
    const groceryStore = this.findGroceryStore(deleteStoreAisleRequest.groceryStoreId);
    const groceryStoreLocationsWithAisle = this.groceryStoreLocations.filter(
      loc => loc.storeId === deleteStoreAisleRequest.groceryStoreId && loc.aisle === deleteStoreAisleRequest.name);
    groceryStoreLocationsWithAisle.forEach((groceryStoreLocation => {
      if (this.pantryItemLocations.some(itemLocation => groceryStoreLocation.id === itemLocation.groceryStoreLocationId)) {
        return throwError(new Error(`Cannot delete ${groceryStore.name} aisle ${deleteStoreAisleRequest.name} \
        as there are pantry items located in the aisle.`));
      } else {
        const indexOfLoc = this.groceryStoreLocations.indexOf(groceryStoreLocation);
        this.groceryStoreLocations.splice(indexOfLoc, 1);
      }
    }));

    groceryStore.aisles.delete(deleteStoreAisleRequest.name);
    return of(true);
  }

  public deleteGroceryStoreSection(deleteStoreSectionRequest: StoreAisleOrSection): Observable<boolean> {
    const groceryStore = this.findGroceryStore(deleteStoreSectionRequest.groceryStoreId);
    const groceryStoreLocationsWithSection = this.groceryStoreLocations.filter(
      loc => loc.storeId === deleteStoreSectionRequest.groceryStoreId && loc.section === deleteStoreSectionRequest.name);
    groceryStoreLocationsWithSection.forEach((groceryStoreLocation => {
      if (this.pantryItemLocations.some(itemLocation => groceryStoreLocation.id === itemLocation.groceryStoreLocationId)) {
        return throwError(new Error(`Cannot delete ${groceryStore.name} section ${deleteStoreSectionRequest.name} \
        as there are pantry items located in the section.`));
      } else {
        const indexOfLoc = this.groceryStoreLocations.indexOf(groceryStoreLocation);
        this.groceryStoreLocations.splice(indexOfLoc, 1);
      }
    }));

    groceryStore.sections.delete(deleteStoreSectionRequest.name);
    return of(true);
  }

  public initialize(): Observable<boolean> {
    return of(true);
  }
  public getGroceryStores(): Observable<GroceryStore[]> {
    console.log('Calling dbHelper.getAllGroceryStores()');
    const ret: GroceryStore[] = [];
    this.groceryStores.forEach((groceryStore) => {
      ret.push({ ...groceryStore, locations: this.groceryStoreLocations.filter(loc => loc.storeId === groceryStore.id) });
    });
    return of(ret);
  }

  public addGroceryStore(newStoreRequest: NewGroceryStoreRequest): Observable<GroceryStore> {
    console.log(`adding: ${JSON.stringify(newStoreRequest)}`);

    if (this.groceryStores.some(groceryStore => groceryStore.name.toUpperCase() === newStoreRequest.name.toUpperCase())) {
      return throwError(new Error(`Grocery store <${newStoreRequest.name}> already exists.`));
    }
    const newStore: GroceryStore = {
      aisles: new Set<string>(),
      id: this.groceryStores.length + 1,
      sections: new Set<string>(),
      locations: [],
      name: newStoreRequest.name
    };
    this.groceryStores.push(newStore);
    return of(newStore);
  }

  public deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): Observable<boolean> {
    let i: number;
    let groceryStoreDeleted: GroceryStore = null;
    if (this.groceryStoreLocations.some(gStore => gStore.id === deleteStoreRequest.id)) {
      this.deleteGroceryStoreLocations(deleteStoreRequest.id);
    }
    for (i = 0; i < this.groceryStores.length; i++) {
      if (this.groceryStores[i].id === deleteStoreRequest.id) {
        groceryStoreDeleted = this.groceryStores[i];
        break;
      }
    }
    if (groceryStoreDeleted === null) {
      return of(false);
    }
    this.groceryStores.splice(i, 1);
    return of(true);
  }

  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisleOrSection): Observable<string> {
    const groceryStore: GroceryStore = this.groceryStores.find((grocerStore) => grocerStore.id === newStoreAisleRequest.groceryStoreId);
    let aisleAdded = '';
    if (groceryStore != null) {
      if (!groceryStore.aisles.has(newStoreAisleRequest.name)) {
        groceryStore.aisles.add(newStoreAisleRequest.name);
        aisleAdded = newStoreAisleRequest.name;
      } else {
        return throwError(new Error(`Aisle ${newStoreAisleRequest.name} already exists.`));
      }
    }
    return of(aisleAdded);
  }

  addGroceryStoreSection(newGroceryStoreSectionRequest: StoreAisleOrSection): Observable<string> {
    const groceryStore: GroceryStore = this.groceryStores.find(
      (grocerStore) => grocerStore.id === newGroceryStoreSectionRequest.groceryStoreId);
    let sectionAdded = '';
    if (groceryStore != null) {
      if (!groceryStore.sections.has(newGroceryStoreSectionRequest.name)) {
        groceryStore.sections.add(newGroceryStoreSectionRequest.name);
        sectionAdded = newGroceryStoreSectionRequest.name;
      } else {
        return throwError(new Error(`${newGroceryStoreSectionRequest.name} already exists.`));
      }
    }
    return of(sectionAdded);
  }

  getGroceryStoreAisles(groceryStoreId: number): Observable<Set<string>> {
    console.log('Inside getGroceryStoreAisles()');
    const groceryStore = this.getGroceryStore(groceryStoreId);
    if (groceryStore === null) {
      return of(new Set<string>());
    }
    return of(groceryStore.aisles);
  }

  getGroceryStoreSections(groceryStoreId: number): Observable<Set<string>> {
    console.log('Inside getGroceryStoreSections()');
    const groceryStore = this.getGroceryStore(groceryStoreId);
    if (groceryStore === null) {
      return of(new Set<string>());
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
    return of([...this.pantryItems]);
  }

  addPantryItem(newPantryItemRequest: PantryItem): Observable<PantryItem> {
      if (this.pantryItems.some(item => item.name.toUpperCase() === newPantryItemRequest.name.toUpperCase())) {
        return throwError(new Error(`${newPantryItemRequest.name} already exists`));
      }
      const newPantryItem = { ...newPantryItemRequest, id: this.pantryItems.length + 1};
      this.pantryItems.push(newPantryItem);
      return of( { ...newPantryItem });
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
    pantryItemToUpdate.quantityNeeded = savePantryItemRequest.quantityNeeded;
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
    return of({ ...this.findPantryItem(id)});
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

  findShoppingItem(id: number): ShoppingItem {
    return  this.shoppingItems.find(pantryItem => pantryItem.pantryItemId === id);
  }

  findGroceryStoreLocation(storeId: number, aisle: string, section: string): GroceryStoreLocation {
    return this.groceryStoreLocations.find(loc => (loc.storeId === storeId) && (loc.aisle === aisle) && (loc.section === section));
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
        this.pantryItemLocations.some((ploc) => ploc.pantryItemId === item.id &&
        this.groceryStoreLocations.some((gloc) => gloc.id === ploc.groceryStoreLocationId && gloc.storeId === storeId));

      if (!itemFoundInStore) {
        return false;
      }
      return !shoppingItems.some((shoppingItem => shoppingItem.pantryItemId === item.id));
    });
  }

  getShoppingList(storeId: number): Observable<ShoppingItem[]> {
    // remove items in shoppingList already purchased / loaded into cart
    const shoppingItemsStillNeeded = this.shoppingItems.filter(shoppingItem => !shoppingItem.inCart);
    const additionalShoppingItemsNeeded: ShoppingItem[] =
      this.getPantryItemsNeededInternal(storeId, shoppingItemsStillNeeded).map((pantryItem: PantryItem) => {
      const pantryItemLocation = this.pantryItemLocations.find(ploc => ploc.pantryItemId === pantryItem.id);
      const groceryStoreLocation = this.groceryStoreLocations.find(gloc => gloc.id === pantryItemLocation.groceryStoreLocationId);
      console.log(`found location for grocery item ${pantryItem.name}; location: ${JSON.stringify(groceryStoreLocation)}`);
      return {
        name: pantryItem.name,
        pantryItemId: pantryItem.id,
        description: pantryItem.description,
        quantity: pantryItem.quantityNeeded,
        inCart: false,
        units: pantryItem.units,
        location: {
          aisle: groceryStoreLocation.aisle,
          section: groceryStoreLocation.section,
        }
      };
    });
    shoppingItemsStillNeeded.push(...additionalShoppingItemsNeeded);
    console.log(`returning: ${shoppingItemsStillNeeded}`);
    return of(shoppingItemsStillNeeded);
  }

  getAislesInUse(groceryStoreId: number): Observable<string[]> {
      const groceryStoreLocationsWithAisleDefined =  this.groceryStoreLocations.filter(loc =>
      loc.storeId === groceryStoreId && loc.aisle);
      const aislesInUse: string[] = [];

      groceryStoreLocationsWithAisleDefined.forEach((groceryStoreLocation) => {
        if (!aislesInUse.some(aisle => aisle === groceryStoreLocation.aisle) &&
          this.pantryItemLocations.some(ploc => ploc.groceryStoreLocationId === groceryStoreLocation.id)) {
          aislesInUse.push(groceryStoreLocation.aisle);
        }
      });
      return of(aislesInUse);
  }

  getSectionsInUse(groceryStoreId: number): Observable<string[]> {
    return this.getItemsInUse(groceryStoreId, 'aisle');
  }

  private getItemsInUse(groceryStoreId: number, propName: string): Observable<string[]> {
    const groceryStoreLocationsItemDefined =  this.groceryStoreLocations.filter(loc =>
      loc.storeId === groceryStoreId && loc[propName]);
    const itemsInUse: string[] = [];

    groceryStoreLocationsItemDefined.forEach((groceryStoreLocation) => {
      if (!itemsInUse.some(item => item === groceryStoreLocation[propName]) &&
        this.pantryItemLocations.some(ploc => ploc.groceryStoreLocationId === groceryStoreLocation.id)) {
        itemsInUse.push(groceryStoreLocation.aisle);
      }
    });
    return of(itemsInUse);
  }

  getGroceryStoreLocations(groceryStoreId: number): Observable<GroceryStoreLocation[]> {
    return of(this.groceryStoreLocations.filter(loc => loc.storeId === groceryStoreId));
  }

  updateGroceryStoreAisle(groceryStoreId: number, oldName: string, newName: string): Observable<boolean> {
    // (1) update aisle name
    const groceryStore = this.getGroceryStore(groceryStoreId);
    if (groceryStore === null) {
      return of(false);
    }
    // (1) update aisle name
    if (groceryStore.aisles.has(oldName)) {
      groceryStore.aisles.delete(oldName);
    }
    groceryStore.aisles.add(newName);

    // (2) update grocery store locations that used old aisle name with new aisle name
    this.groceryStoreLocations.filter(loc => loc.storeId === groceryStoreId && loc.aisle === oldName)
      .forEach(loc => loc.aisle = newName);

    return of(true);
  }

  private deleteGroceryStoreLocations(groceryStoreId: number) {
      const indecesToDelete = [];
      for (let i = 0; i < this.groceryStoreLocations.length; i++) {
        if (this.groceryStoreLocations[i].storeId === groceryStoreId) {
            const gloc = this.groceryStoreLocations[i];
            indecesToDelete.push(i);
            if (this.pantryItemLocations.some(ploc => ploc.groceryStoreLocationId === gloc.id)) {
              this.deletePantryItemLocations(gloc.id);
            }
        }
      }

      while (indecesToDelete.length > 0) {
        this.groceryStoreLocations.splice(indecesToDelete.pop(), 1);
      }
  }

  private deletePantryItemLocations(locId: number) {
      const indecesToDelete =  [];
      for (let i = 0; i < this.pantryItemLocations.length; i++) {
        if (this.pantryItemLocations[i].groceryStoreLocationId === locId) {
          indecesToDelete.push(i);
        }
      }

      while (indecesToDelete.length > 0) {
        this.pantryItemLocations.splice(indecesToDelete.pop(), 1);
      }
  }

  updateShoppingItem(pantryItemId: number, inCart: boolean): Observable<boolean> {
    const shopingItemToUpdate = this.findShoppingItem(pantryItemId);
    shopingItemToUpdate.inCart = inCart;
    const pantryItemToUpdate = this.findPantryItem(pantryItemId);
    pantryItemToUpdate.need = !inCart;
    return of(true);
    }
}
