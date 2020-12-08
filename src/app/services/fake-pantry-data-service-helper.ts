import {GroceryStore} from '../model/grocery-store';
import {PantryItem} from '../model/pantry-item';
import {PantryItemLocation} from '../model/PantryItemLocation';
import {GroceryStoreLocation} from '../model/grocery-store-location';
import {ShoppingItem} from '../model/shopping-item';
import {Observable, of, throwError} from 'rxjs';
import {GroceryStoreAisle} from '../model/grocery-store-aisle';
import {GroceryStoreSection} from '../model/grocery-store-section';
import {StoreAisleOrSection} from '../modules/store-management/dumb-components/grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {
  DeleteGroceryStoreRequest,
  NewGroceryStoreRequest
} from '../modules/store-management/dumb-components/store-list/store-list.component';
import {DeletePantryItemRequest} from '../modules/pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {HggsData} from '../model/hggs-data';
import {Injectable} from '@angular/core';

@Injectable()
export class FakePantryDataServiceHelper {
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
    // this.shoppingItems = [];
    this.pantryItemLocations = [];
    this.groceryStoreLocations = [];
  }

  private readonly groceryStores: GroceryStore[];
  private readonly pantryItems: PantryItem[];
  private readonly pantryItemLocations: PantryItemLocation[];
  private readonly groceryStoreLocations: GroceryStoreLocation[];

  deletePantryItemLocation(pantryItemId: number, locationId: number): boolean {
    const index = this.pantryItemLocations.findIndex((loc) => loc.groceryStoreLocationId === locationId && loc.pantryItemId === pantryItemId);
    this.pantryItemLocations.splice(index,1);
    return true;
  }

  getAllGroceryStoreAisles(): GroceryStoreAisle[] {
    const result: {storeId: number, aisle: string}[] = [];
    this.groceryStores.forEach(gStore => {
      gStore.aisles.forEach(aisle => result.push({storeId: gStore.id, aisle}));
    });
    return result;
  }

  getAislesInUse(groceryStoreId: number): string[] {
    const groceryStoreLocationsWithAisleDefined =  this.groceryStoreLocations.filter(loc =>
      loc.storeId === groceryStoreId && loc.aisle);
    const aislesInUse: string[] = [];

    groceryStoreLocationsWithAisleDefined.forEach((groceryStoreLocation) => {
      if (!aislesInUse.some(aisle => aisle === groceryStoreLocation.aisle) &&
        this.pantryItemLocations.some(ploc => ploc.groceryStoreLocationId === groceryStoreLocation.id)) {
        aislesInUse.push(groceryStoreLocation.aisle);
      }
    });
    return aislesInUse;
  }

  public getPantryItemLocations(id: number): GroceryStoreLocation[] {
    const pantryItemLocations: PantryItemLocation[] =  this.pantryItemLocations.filter(location => location.pantryItemId === id);
    const result = [];
    pantryItemLocations.forEach( pantryItemLoc => {
      result.push(this.groceryStoreLocations.find(x => x.id === pantryItemLoc.groceryStoreLocationId));
    });
    return result;
  }

  public getShoppingList(storeId: number): ShoppingItem[] {
    return this.pantryItems.filter(pantryItem => pantryItem.need && !pantryItem.inCart).map( pantryItem => {
      const pantryItemLocation = this.pantryItemLocations.find(ploc => ploc.pantryItemId === pantryItem.id);
      const groceryStoreLocation = this.groceryStoreLocations.find(gloc => gloc.id === pantryItemLocation.groceryStoreLocationId);
      return {
        name: pantryItem.name,
        pantryItemId: pantryItem.id,
        description: pantryItem.description,
        quantity: pantryItem.quantityNeeded,
        inCart: false,
        units: pantryItem.units,
        storeId: groceryStoreLocation.storeId,
        location:
          {
            locationId: groceryStoreLocation.id,
            aisle: groceryStoreLocation.aisle,
            section: groceryStoreLocation.section
          }
      };
    });
  }
  public findGroceryStoreLocation(storeId: number, aisle: string, section: string): GroceryStoreLocation {
    return this.groceryStoreLocations.find(loc => (loc.storeId === storeId) && (loc.aisle === aisle) && (loc.section === section));
  }

  public findGroceryStoreLocationById(locationId): GroceryStoreLocation {
    const result = this.groceryStoreLocations.find(loc => (loc.id === locationId));
    if (result) {
      return {...result};
    }
  }

  public findGroceryStore(id: number): GroceryStore {
    return this.groceryStores.find(store => store.id === id);
  }

  public findPantryItemLocation(itemId: number, storeId: number): GroceryStoreLocation {

    const itemLocations = this.pantryItemLocations.filter(pantryItemLocation =>
      pantryItemLocation.pantryItemId === itemId);

    return this.groceryStoreLocations.find(storeLocation => storeLocation.storeId === storeId &&
      itemLocations.some(itemLocation => itemLocation.groceryStoreLocationId === storeLocation.id));
  }

  findGroceryStoreLocations(groceryStoreId: number): GroceryStoreLocation[] {
    return this.groceryStoreLocations.filter(loc => loc.storeId === groceryStoreId);
  }

  public findPantryItem(id: number): PantryItem {
    return  this.pantryItems.find(pantryItem => pantryItem.id === id);
  }

  getPantryItems(): PantryItem[] {
    return [...this.pantryItems];
  }

  public getPantryItemsNeededInternal(storeId: number, shoppingItems: ShoppingItem[]): PantryItem[] {
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
  public findItemsInUse(groceryStoreId: number, propName: string): string[] {
    const groceryStoreLocationsItemDefined =  this.groceryStoreLocations.filter(loc =>
      loc.storeId === groceryStoreId && loc[propName]);
    const itemsInUse: string[] = [];

    groceryStoreLocationsItemDefined.forEach((groceryStoreLocation) => {
      if (!itemsInUse.some(item => item === groceryStoreLocation[propName]) &&
        this.pantryItemLocations.some(ploc => ploc.groceryStoreLocationId === groceryStoreLocation.id)) {
        itemsInUse.push(groceryStoreLocation.aisle);
      }
    });
    return itemsInUse;
  }

  getAllGroceryStoreSections(): GroceryStoreSection[] {
    const result: {storeId: number, section: string}[] = [];
    this.groceryStores.forEach(gStore => {
      gStore.aisles.forEach(section => result.push({storeId: gStore.id, section}));
    });
    return result;
  }

  getGroceryStoreByName(name: string): GroceryStore {
    const result = this.groceryStores.find((store) => store.name === name);
    if (result) {
      return result;
    }
    return null;
  }

  getPantryItemByName(name: string): PantryItem {
    const result =  this.pantryItems.find((item) => item.name === name);
    if (result) {
      return result;
    }
    return null;
  }

  deleteGroceryStoreAisle(deleteStoreAisleRequest: StoreAisleOrSection): boolean {
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
    return true;
  }

  public deleteGroceryStoreSection(deleteStoreSectionRequest: StoreAisleOrSection): boolean {
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
    return true;
  }
  public getGroceryStores(): GroceryStore[] {
    const ret: GroceryStore[] = [];
    this.groceryStores.forEach((groceryStore) => {
      ret.push({ ...groceryStore, locations: this.groceryStoreLocations.filter(loc => loc.storeId === groceryStore.id) });
    });
    return ret;
  }

  public addGroceryStore(newStoreRequest: NewGroceryStoreRequest): GroceryStore {
    console.log(`adding: ${JSON.stringify(newStoreRequest)}`);

    if (this.groceryStores.some(groceryStore => groceryStore.name.toUpperCase() === newStoreRequest.name.toUpperCase())) {
      throw new Error(`Grocery store <${newStoreRequest.name}> already exists.`);
    }
    const newStore = this.addNewGroceryStore(newStoreRequest);

    return newStore;
  }

  addNewGroceryStore(newStoreRequest: NewGroceryStoreRequest): GroceryStore {
    const newStore: GroceryStore = {
      aisles: new Set<string>(),
      id: this.groceryStores.length + 1,
      sections: new Set<string>(),
      locations: [],
      name: newStoreRequest.name
    };
    this.groceryStores.push(newStore);
    return newStore;
  }

  public deleteGroceryStore(deleteStoreRequest: DeleteGroceryStoreRequest): boolean {
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
      return false;
    }
    this.groceryStores.splice(i, 1);
    return true;
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
  public getAllGroceryStores(): GroceryStore[] {
    const ret: GroceryStore[] = [];
    this.groceryStores.forEach((groceryStore) => {
      ret.push({ ...groceryStore, locations: this.groceryStoreLocations.filter(loc => loc.storeId === groceryStore.id) });
    });
    return ret;
  }

  public addGroceryStoreAisle(newStoreAisleRequest: StoreAisleOrSection): string {
    const groceryStore: GroceryStore = this.groceryStores.find((grocerStore) => grocerStore.id === newStoreAisleRequest.groceryStoreId);
    let aisleAdded = '';
    if (groceryStore != null) {
      if (!groceryStore.aisles.has(newStoreAisleRequest.name)) {
        groceryStore.aisles.add(newStoreAisleRequest.name);
        aisleAdded = newStoreAisleRequest.name;
      } else {
        throw new Error(`Aisle ${newStoreAisleRequest.name} already exists.`);
      }
    }
    return aisleAdded;
  }

  public addGroceryStoreSection(newGroceryStoreSectionRequest: StoreAisleOrSection): string {
    const groceryStore: GroceryStore = this.groceryStores.find(
      (grocerStore) => grocerStore.id === newGroceryStoreSectionRequest.groceryStoreId);
    let sectionAdded = '';
    if (groceryStore != null) {
      if (!groceryStore.sections.has(newGroceryStoreSectionRequest.name)) {
        groceryStore.sections.add(newGroceryStoreSectionRequest.name);
        sectionAdded = newGroceryStoreSectionRequest.name;
      } else {
        throw new Error(`${newGroceryStoreSectionRequest.name} already exists.`);
      }
    }
    return sectionAdded;
  }

  updatePantryItemLocation(itemId: number,
                           originalLocationId: number,
                           newLocation: GroceryStoreLocation): GroceryStoreLocation {
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

    return groceryStoreLocation;
  }

  updateGroceryStoreAisle(groceryStoreId: number, oldName: string, newName: string): boolean {
    // (1) update aisle name
    const groceryStore = this.findGroceryStore(groceryStoreId);
    if (groceryStore === null) {
      return false;
    }
    // (1) update aisle name
    if (groceryStore.aisles.has(oldName)) {
      groceryStore.aisles.delete(oldName);
    }
    groceryStore.aisles.add(newName);

    // (2) update grocery store locations that used old aisle name with new aisle name
    this.groceryStoreLocations.filter(loc => loc.storeId === groceryStoreId && loc.aisle === oldName)
      .forEach(loc => loc.aisle = newName);

    return true;
  }

  getAllGroceryStoreLocations(): GroceryStoreLocation[] {
    return this.groceryStoreLocations;
  }

  getAllPantryItemLocations(): PantryItemLocation[] {
    return this.pantryItemLocations;
  }

  addPantryItem(newPantryItemRequest: PantryItem): PantryItem {
    if (this.pantryItems.some(item => item.name.toUpperCase() === newPantryItemRequest.name.toUpperCase())) {
      throw new Error(`${newPantryItemRequest.name} already exists`);
    }
    const newPantryItem = { ...newPantryItemRequest, id: this.pantryItems.length + 1};
    this.pantryItems.push(newPantryItem);
    return { ...newPantryItem };
  }

  deletePantryItem(deletePantryItemRequest: DeletePantryItemRequest): boolean {
    let index: number;

    do {
      index = this.pantryItemLocations.findIndex((loc) => loc.pantryItemId === deletePantryItemRequest.id);
      if (index >= 0) {
        this.pantryItemLocations.splice(index, 1);
      }
    } while (index >= 0);

    index = this.pantryItems.findIndex(item => item.id === deletePantryItemRequest.id);
    if (index >= 0) {
      this.pantryItems.splice(index, 1);
      return true;
    }
    return false;
  }

  addPantryItemLocation(itemId: number, storeLocationId: number): boolean {
    this.pantryItemLocations.push({
      pantryItemId: itemId,
      groceryStoreLocationId: storeLocationId
    });

    return true;
  }

  addNewPantryItemLocation(itemId: number, newLocation: GroceryStoreLocation): GroceryStoreLocation {
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

    return groceryStoreLocation;
  }

  importHggsData(data: HggsData): boolean {
    data.groceryStores.forEach(groceryStoreToImport => {
      let groceryStore: GroceryStore;
      if (!this.groceryStores.some(candidateGroceryStore => candidateGroceryStore.name === groceryStoreToImport.name)) {
        groceryStore = this.addNewGroceryStore({name: groceryStore.name});
      } else {
        groceryStore = this.groceryStores.find(candidateGroceryStore => candidateGroceryStore.name === groceryStoreToImport.name)
      }
    });
    // todo: finish
    return undefined;
  }

  addNewShoppingItemInNewLocation(newPantryItemRequest: PantryItem, storeLocation: GroceryStoreLocation): ShoppingItem {
    const pantryItem = this.addPantryItem(newPantryItemRequest);
    const location = this.addNewPantryItemLocation(pantryItem.id, storeLocation);
    return {
      ...pantryItem,
      pantryItemId: pantryItem.id,
      storeId: storeLocation.storeId,
      quantity: pantryItem.quantityNeeded,
      location: {
        locationId: location.id,
        aisle: location.aisle,
        section: location.section
      }
    };
  }
}
