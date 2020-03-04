import {ShoppingActions, ShoppingActionTypes} from './shopping.actions';
import {EntityState} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import * as fromAdapter from './shopping.adapter';

export class SectionItems {
  section: string;
  items: ShoppingItem[];
  constructor(section: string, items: ShoppingItem[]) {
    this.section = section;
    this.items = items.filter((item) => item.location.section === this.section);
  }
}

export class AisleItems {
  aisle: string;
  items: ShoppingItem[];

  constructor(aisle: string, items: ShoppingItem[]) {
    this.aisle = aisle;
    this.items = items.filter((item) => item.location.aisle === this.aisle);
  }
}

export interface IStoreShoppingList {
  groceryStoreId: number;
  shoppingItems: ShoppingItem[];
  aisles: AisleItems[];
  sections: SectionItems[];
}

export class StoreShoppingList implements IStoreShoppingList {

  constructor(storeId: number, shoppingItems: ShoppingItem[]) {
    this.groceryStoreId = storeId;

    const distinctAisles = Array.from(new Set(shoppingItems.map(x => x.location.aisle)));
    distinctAisles.forEach( aisle => this.aisles.push(new AisleItems(aisle, shoppingItems)));
    const shoppingItemsWithNoAisles = shoppingItems.filter(item => !item.location.aisle);
    const distinctSectionsWithNoAisles = Array.from(new Set(shoppingItemsWithNoAisles.map(x => x.location.section)));
    distinctSectionsWithNoAisles.forEach( section => this.sections.push(new SectionItems(section, shoppingItems)));
    this.shoppingItems = shoppingItems.filter(item => !item.location.aisle && !item.location.section);
  }

  aisles: AisleItems[];
  groceryStoreId: number;
  sections: SectionItems[];
  shoppingItems: ShoppingItem[];
}

export class ShoppingListState extends StoreShoppingList {
  loading: boolean;
  error: Error;
  constructor(storeId: number, list: ShoppingItem[]) {
    super(storeId, list);
    this.loading = false;
    this.error = null;
  }
}

export interface ShoppingListManagementState {
  shoppingLists: EntityState<ShoppingListState>;
  loading: boolean;
  error: Error;
}

export const initialShoppingListManagementState: ShoppingListManagementState = {
  shoppingLists: fromAdapter.shoppingListAdapter.getInitialState(),
  loading: false,
  error: null
};

export function shoppingListManagementReducer(state = initialShoppingListManagementState,
                                              action: ShoppingActions): ShoppingListManagementState  {
  switch (action.type) {
    case ShoppingActionTypes.LoadShoppingListSucceeded: {
      return {
        ...state,
        shoppingLists: fromAdapter.shoppingListAdapter.upsertOne( new ShoppingListState(action.storeId, action.shoppingList),
          state.shoppingLists),
      };
    }
    default: return state;
  }
}
