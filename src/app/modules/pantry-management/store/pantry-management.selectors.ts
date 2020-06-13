import * as fromAdapter from './pantry.adapter';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {PantryManagementState} from './pantry-management.reducers';
import {PantryItem} from '../../../model/pantry-item';
import {PantryState} from './pantry-management.reducers';
import {GroceryStoreLocation} from '../../../model/grocery-store-location';
import {selectAllGroceryStores} from '../../../store/store-management.selectors';

export const getPantryManagementState = createFeatureSelector<PantryManagementState>('pantryManagement');

export const getPantryItemsState = createSelector(
  getPantryManagementState,
  (state: PantryManagementState) => state.pantryItems
);


export const selectPantryItemEntities = createSelector(
  getPantryItemsState,
  fromAdapter.selectPantryItemEntities
);

export const selectPantryItemIds = createSelector(
  getPantryItemsState,
  fromAdapter.selectPantryItemIds
);

export const selectGroceryStoreCount = createSelector(
  getPantryItemsState,
  fromAdapter.pantryItemCount
);

export const selectAllPantryItems = createSelector(
  getPantryItemsState,
  fromAdapter.selectAllPantryItems
);

export const selectPantryItem = (id: number) => createSelector(
  selectAllPantryItems, (state: PantryItem[]) => state.find((item) => item.id === id));

export const selectPantryItemLocations = (id: number) => createSelector(
  selectPantryItem(id), (state: PantryItem) => state.locations);

export const selectPantryItemsNeededFromStore = (storeId: number) => createSelector(
  selectAllPantryItems, (state: PantryItem[]) => state.filter(item => item.need && item.locations.find(loc => loc.storeId === storeId)));

export const selectPantryItemsLoading = createSelector(
  getPantryItemsState,
  (state: PantryState) => state.loading
);

export const selectPantryItemsError = createSelector(
  getPantryItemsState,
  (state: PantryState) => state.error
);

export const selectGroceryStoresItemIsLocatedIn = (pantryItemId: number) => createSelector(
  selectPantryItemLocations(pantryItemId),(existingLocations: GroceryStoreLocation[]) =>
    existingLocations.map(location => location.storeId));

// export const selectGroceryStoresItemIsNotLocatedIn = (pantryItemId: number) => createSelector(
//   selectGroceryStoresItemIsLocatedIn(pantryItemId), (existingGroceryStores: number[]) => {
//     selectAllGroceryStores()
//
//   });

export const getPantryItem = (state: PantryState, id: number) => state.entities[id];
