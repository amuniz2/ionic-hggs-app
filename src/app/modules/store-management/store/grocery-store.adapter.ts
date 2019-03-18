import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {GroceryStore} from '../model/grocery-store';

function sortByGroceryStoreName( store1: GroceryStore, store2: GroceryStore): number {
  return store1.name.localeCompare(store2.name);
}

export const groceryStoreAdapter: EntityAdapter<GroceryStore> = createEntityAdapter<GroceryStore>({sortComparer: sortByGroceryStoreName});

export const {
  selectAll : selectAllGroceryStores,
  selectEntities : selectGroceryStoreEntities,
  selectIds : selectGroceryStoreIds,
  selectTotal : groceryStoreCount,
} = groceryStoreAdapter.getSelectors();
