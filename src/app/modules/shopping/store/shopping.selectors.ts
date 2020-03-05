import * as fromAdapter from './shopping.adapter';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ShoppingListManagementState, ShoppingListState} from './shopping.reducers';
import {ShoppingItem} from '../../../model/shopping-item';

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
  selectAllShoppingLists, (state: ShoppingListState[]) => state.find((item) => item.id === id));

export const selectShoppingListItems = (id: number) => createSelector(
  selectShoppingList(id), (state: ShoppingListState) => state.shoppingItems.sort(compareByStoreLocation));

export const selectShoppingListItemsGroupedByAisle = (id: number) => createSelector(
  selectShoppingList(id), (state: ShoppingListState) => state.aisles);

export const selectShoppingListItemsGroupedBySection = (id: number) => createSelector(
  selectShoppingList(id), (state: ShoppingListState) => state.sections);

export const getShoppingList = (state: ShoppingListManagementState, id: number) => state.shoppingLists.entities[id];

export const getShoppingListItems = (state: ShoppingListManagementState, id: number) => getShoppingList(state, id).shoppingItems;

const compareByStoreLocation = ( item1: ShoppingItem, item2: ShoppingItem): number => {
  // sort by location in store
  if (item1.location.aisle === item2.location.aisle) {
    if (item1.location.section === item2.location.section) {
      return item1.pantryItem.name < item2.pantryItem.name ? -1 : 1;
    } else {
      return item1.location.section < item2.location.section ? -1 : 1;
    }
  } else {
    return item1.location.aisle < item2.location.aisle ? -1 : 1;
  }
  return 0;
}
