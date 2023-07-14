import * as fromAdapter from './shopping.adapter';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ShoppingListManagementState} from './shopping.reducers';
import {ShoppingItem} from '../../../model/shopping-item';
import {ShoppingItemState} from './shopping.adapter';

export const getShoppingListManagementState = createFeatureSelector<ShoppingListManagementState>('shoppingListManagement');

export const getShoppingListsState = createSelector(
  getShoppingListManagementState,
  (state: ShoppingListManagementState) => state.shoppingItems
);

export const selectShoppingListEntities = createSelector(
  getShoppingListsState,
  fromAdapter.selectShoppingItemEntities
);

export const selectShoppingListIds = createSelector(
  getShoppingListsState,
  fromAdapter.selectShoppingItemIds
);

export const selectShoppingListCount = createSelector(
  getShoppingListsState,
  fromAdapter.shoppingItemCount
);

export const selectAllShoppingItems = createSelector(
  getShoppingListsState,
  fromAdapter.selectAllShoppingItems
);

export const selectStoreShoppingItems = (storeId: number) => createSelector(
  selectAllShoppingItems, (state: ShoppingItemState[]) => state.filter((item) => item.shoppingItem.storeId === storeId)
    .map((item) => {
      return {...item.shoppingItem};
    }));

 export const selectCurrrentStoreShoppingItem = (storeId?: number, locationId?: number, pantryItemId?: number) => createSelector(
  selectAllShoppingItems, (state: ShoppingItemState[]) => state.find((item) => item.shoppingItem.storeId === storeId && item.shoppingItem.location.locationId === locationId)?.shoppingItem);

// export const selectShoppingListItems = (id: number) => createSelector(
//   selectAllShoppingLists, (state: ShoppingListState) => state.shoppingItems.sort(compareByStoreLocation));

// export const selectShoppingListItemsGroupedByAisle = (id: number) => createSelector(
//   selectStoreShoppingItems(id), (state: ShoppingListState) => state.aisles);
//
// export const selectShoppingListItemsGroupedBySection = (id: number) => createSelector(
//   selectStoreShoppingItems(id), (state: ShoppingListState) => state.sections);

export const getShoppingList = (state: ShoppingListManagementState, id: number) => state.shoppingItems.entities[id];

/// export const getShoppingListItems = (state: ShoppingListManagementState, id: number) => getShoppingList(state, id).shoppingItems;

const compareByStoreLocation = ( item1: ShoppingItem, item2: ShoppingItem): number => {
  // sort by location in store
  if (item1.location.aisle === item2.location.aisle) {
    if (item1.location.section === item2.location.section) {
      return item1.name < item2.name ? -1 : 1;
    } else {
      return item1.location.section < item2.location.section ? -1 : 1;
    }
  } else {
    return item1.location.aisle < item2.location.aisle ? -1 : 1;
  }
  return 0;
}
