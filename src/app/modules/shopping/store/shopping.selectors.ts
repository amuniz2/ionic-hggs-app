import * as fromAdapter from './shopping.adapter';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ShoppingListManagementState, ShoppingListState} from './shopping.reducers';

export const getShoppingListManagementState = createFeatureSelector<ShoppingListManagementState>('shoppingListManagement');

export const getShoppingListsState = createSelector(
  getShoppingListManagementState,
  (state: ShoppingListManagementState) => state.shoppingLists
);


export const selectShoppingListEntities = createSelector(
  getShoppingListsState,
  fromAdapter.selectShoppingListEntities
);

export const selectShoppingListIds = createSelector(
  getShoppingListsState,
  fromAdapter.selectShoppingListIds
);

export const selectShoppingListCount = createSelector(
  getShoppingListsState,
  fromAdapter.shoppingListCount
);

export const selectAllShoppingLists = createSelector(
  getShoppingListsState,
  fromAdapter.selectAllShoppingLists
);

export const selectShoppingList = (id: number) => createSelector(
  selectAllShoppingLists, (state: ShoppingListState[]) => state.find((item) => item.groceryStoreId === id));

export const selectShoppingListItems = (id: number) => createSelector(
  selectShoppingList(id), (state: ShoppingListState) => state.shoppingItems);

export const getShoppingList = (state: ShoppingListManagementState, id: number) => state.shoppingLists.entities[id];

export const getShoppingListItems = (state: ShoppingListManagementState, id: number) => getShoppingList(state, id).shoppingItems;
