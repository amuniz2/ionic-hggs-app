import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import {ShoppingListState} from './shopping.reducers';

function sortByLocation( item1: ShoppingItem, item2: ShoppingItem): number {
  // sort by location in store
  return 0;
}

export const shoppingAdapter: EntityAdapter<ShoppingItem> = createEntityAdapter<ShoppingItem>({sortComparer: sortByLocation});

export const {
  selectAll : selectAllShoppingItems,
  selectEntities : selectShoppingItemEntities,
  selectIds : selectShoppingItemIds,
  selectTotal : shoppingItemCount,
} = shoppingAdapter.getSelectors();

function sortByGroceryStore( item1: ShoppingListState, item2: ShoppingListState): number {
  // sort by location in store
  return item2.groceryStoreId - item2.groceryStoreId;
}

export const shoppingListAdapter: EntityAdapter<ShoppingListState> =
  createEntityAdapter<ShoppingListState>({sortComparer: sortByGroceryStore});

export const {
  selectAll : selectAllShoppingLists,
  selectEntities : selectShoppingListEntities,
  selectIds : selectShoppingListIds,
  selectTotal : shoppingListCount,
} = shoppingListAdapter.getSelectors();
