import {getGroceryStoresState, GroceryStoresState} from './store-management.reducers';
import {createSelector} from '@ngrx/store';
import {GroceryStore} from '../model/grocery-store';
import * as fromAdapter from './grocery-store.adapter';

export const selectAllGroceryStores =  createSelector(
  getGroceryStoresState,
  fromAdapter.selectAllGroceryStores
);

export const selectGroceryStore = (id: number) => createSelector(
  selectAllGroceryStores, (state: GroceryStore[]) => state.find((store) => store.id === id));
