import {ShoppingActions, ShoppingActionTypes} from './shopping.actions';
import {EntityState} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import * as fromAdapter from './shopping.adapter';


export interface ShoppingListState  {
  groceryStoreId: number;
  shoppingItems: ShoppingItem[];
  loading: boolean;
  error: Error;
}

export interface ShoppingListManagementState {
  shoppingLists: EntityState<ShoppingListState>;
}

export const initialShoppingListManagementState: ShoppingListManagementState = {
  shoppingLists: fromAdapter.shoppingListAdapter.getInitialState(),
};

export function shoppingListManagementReducer(state = initialShoppingListManagementState,
                                              action: ShoppingActions): ShoppingListManagementState  {
  switch (action.type) {
    case ShoppingActionTypes.LoadShoppingListSucceeded: {
      return {
        ...state,
        shoppingLists: fromAdapter.shoppingListAdapter.upsertOne( {
          groceryStoreId: action.storeId,
          loading: false,
          error: null,
          shoppingItems: action.shoppingList
        }, state.shoppingLists),
      };
    }
    default: return state;
  }
}
