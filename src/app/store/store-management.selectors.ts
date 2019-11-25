import {createFeatureSelector, createSelector, select} from '@ngrx/store';
import {GroceryStore} from '../model/grocery-store';
import {AppState, GroceryStoresState} from './app.state';
import * as fromAdapter from './grocery-store.adapter';
// import * as fromAdapter from '../../store-management/store/grocery-store.adapter';

// export const getStoreManagementState = createFeatureSelector<SharedStoresState>('storeManagement');
const getAppState = createFeatureSelector<AppState>('app');
export const getGroceryStoresState = createSelector(
  getAppState,
  (state: AppState) => state.groceryStores
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

export const selectGroceryStoreAisles = (id: number) => createSelector(
  selectGroceryStore(id), (state: GroceryStore) => state.aisles);

export const selectGroceryStoreSections = (id: number) => createSelector(
  selectGroceryStore(id), (state: GroceryStore) => state.sections);

export const selectGroceryStoresLoading = createSelector(
  getGroceryStoresState,
  (state: GroceryStoresState) => state.loading
);

export const getGroceryStore = (state: GroceryStoresState, id: number) => state.entities[id];
