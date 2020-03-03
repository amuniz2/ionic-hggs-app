import {ShoppingActions, ShoppingActionTypes} from './shopping.actions';
import {EntityState} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import * as fromAdapter from './shopping.adapter';

export class SectionItems {
  section: string;
  items: ShoppingItem[];
  constructor(aisle: string, items: ShoppingItem[]) {
    this.section = (items && items.length > 0) ? items[0].location.section : '';
    this.items = items.filter((item) => item.location.section === this.section && item.location.aisle === aisle);
  }
}

export class AisleItems {
  aisle: string;
  items: ShoppingItem[];
  sections: SectionItems[];

  constructor(items: ShoppingItem[]) {
    this.aisle = (items && items.length > 0) ? items[0].location.aisle : '';
    const itemsInAisle =  items.filter((item) => item.location.aisle === this.aisle);
    this.items = itemsInAisle.filter((item) => item.location.aisle === this.aisle && !item.location.section);
    const itemsInSectionsWithinAisle = itemsInAisle.filter((item) => item.location.section);
    itemsInSectionsWithinAisle.forEach(item => {

      this.sections.push(new SectionItems(item.location.section, itemsInSectionsWithinAisle));
    })

  }
}
export interface ShoppingListState  {
  groceryStoreId: number;
  shoppingItems: ShoppingItem[];
  aisles: AisleItems[];
  sections: SectionItems[];
  loading: boolean;
  error: Error;
}

export interface ShoppingListManagementState {
  shoppingLists: EntityState<ShoppingListState>;
}

export const initialShoppingListManagementState: ShoppingListManagementState = {
  shoppingLists: fromAdapter.shoppingListAdapter.getInitialState(),
};

class ShoppingListByLocation {
  groceryStoreId: number;
  shoppingItems: ShoppingItem[];
  aisles: AisleItems[];
  sections: SectionItems[];
  loading: boolean;
  error: Error;

  constructor(shoppingList: ShoppingItem[]) {
  }
}

export function shoppingListManagementReducer(state = initialShoppingListManagementState,
                                              action: ShoppingActions): ShoppingListManagementState  {
  convertToShoppingListDictionary(action.shoppingList);
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
