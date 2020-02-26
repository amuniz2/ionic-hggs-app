import {ShoppingActions, ShoppingActionTypes} from './shopping.actions';
import {EntityState} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/pantry-item';
import * as fromAdapter from './shopping.adapter';
import {from} from 'rxjs';


export interface ShoppingListState  extends EntityState<ShoppingItem> {
  groceryStoreId: number;
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
      state.shoppingLists
      return {
        ...state,
        shoppingLists: fromAdapter.shoppingListAdapter.upsertOne(action.shoppingList,
          state.shoppingLists),
      };
    }
    default: return state;
  }

}
