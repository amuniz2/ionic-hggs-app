import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {GroceryStore, GroceryStoreState} from '../model/grocery-store';
import {GroceryStoreLocation} from '../model/grocery-store-location';

function sortByGroceryStoreName( store1: GroceryStoreState, store2: GroceryStoreState): number {
  return store1.name.localeCompare(store2.name);
}

function sortByLocationStoreName( store1: GroceryStoreLocation, store2: GroceryStoreLocation): number {
  return store1.storeName.localeCompare(store2.storeName);
}

export const sharedGroceryStoreAdapter: EntityAdapter<GroceryStoreState> =
  createEntityAdapter<GroceryStoreState>({sortComparer: sortByGroceryStoreName});

export const sharedGroceryStoreLocationAdapter: EntityAdapter<GroceryStoreLocation> =
  createEntityAdapter<GroceryStoreLocation>({sortComparer: sortByLocationStoreName});

export const {
  selectAll : selectAllGroceryStores,
  selectEntities : selectGroceryStoreEntities,
  selectIds : selectGroceryStoreIds,
  selectTotal : groceryStoreCount,
} = sharedGroceryStoreAdapter.getSelectors();

export const {
  selectAll : selectAllGroceryStoreLocations,
  selectEntities : selectGroceryStoreLocationEntities,
  selectIds : selectGroceryStoreLocationIds,
  selectTotal : groceryStoreLocationCount,
} = sharedGroceryStoreLocationAdapter.getSelectors();
