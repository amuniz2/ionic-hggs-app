import * as fromAdapter from './pantry.adapter';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {PantryManagementState} from './pantry-management.reducers';
import {PantryItem} from '../../../model/pantry-item';
import {PantryState} from './pantry-management.reducers';

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

// export const selectPantryItemLocations = (id: number) => createSelector(
//   selectPantryItem(id), (state: PantryItem) => state.locations);

export const selectPantryItemsLoading = createSelector(
  getPantryItemsState,
  (state: PantryState) => state.loading
);

export const selectPantryItemsError = createSelector(
  getPantryItemsState,
  (state: PantryState) => state.error
);

export const getPantryItem = (state: PantryState, id: number) => state.entities[id];