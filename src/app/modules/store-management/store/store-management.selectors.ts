import {GroceryStoresState, StoreManagementState} from './store-management.reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {GroceryStore} from '../model/grocery-store';
import * as fromAdapter from './grocery-store.adapter';

export const getStoreManagementState = createFeatureSelector<StoreManagementState>('storeManagement');

export const getGroceryStoresState = createSelector(
  getStoreManagementState,
  (state: StoreManagementState) => state.groceryStores
);

export const selectGroceryStoreEntities = createSelector(
  getGroceryStoresState,
  fromAdapter.selectGroceryStoreEntities
);

export const selectGroceryStoreIds = createSelector(
  getGroceryStoresState,
  fromAdapter.selectGroceryStoreIds
);

export const selectGroceryStoreCount = createSelector(
  getGroceryStoresState,
  fromAdapter.groceryStoreCount
);

export const selectAllGroceryStores = createSelector(
  getGroceryStoresState,
  fromAdapter.selectAllGroceryStores
);

export const selectGroceryStore = (id: number) => createSelector(
  selectAllGroceryStores, (state: GroceryStore[]) => state.find((store) => store.id === id));

export const selectGroceryStoresLoading = createSelector(
  getGroceryStoresState,
  (state: GroceryStoresState) => state.loading
);

