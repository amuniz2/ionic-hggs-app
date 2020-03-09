import {ShoppingActions, ShoppingActionTypes} from './shopping.actions';
import {EntityState} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import {shoppingListAdapter} from './shopping.adapter';

export class SectionItems {
  section: string;
  items: ShoppingItem[];
  constructor(section: string, items: ShoppingItem[]) {
    this.section = section;
    this.items = items.filter((item) => item.location.section === this.section);
  }
}

export class AisleItems {
  name: string;
  items: ShoppingItem[];

  constructor(aisle: string, items: ShoppingItem[]) {
    this.name = aisle;
    this.items = items.filter((item) => item.location.aisle === this.name);
  }
}

export interface IStoreShoppingList {
  id: number;
  shoppingItems: ShoppingItem[];
  aisles: AisleItems[];
  sections: SectionItems[];
}

export class StoreShoppingList implements IStoreShoppingList {

  constructor(storeId: number, shoppingItems: ShoppingItem[]) {
    this.id = storeId;
    this.aisles = [];
    this.sections = [];

    const distinctAisles = Array.from(new Set(shoppingItems.filter(item => item.location.aisle).map(x => x.location.aisle)));
    distinctAisles.forEach( aisle => this.aisles.push(new AisleItems(aisle,
      shoppingItems.filter(shoppingItem => shoppingItem.location.aisle === aisle))));
    const shoppingItemsWithNoAisles = shoppingItems.filter(item => !item.location.aisle);
    const distinctSectionsWithNoAisles = Array.from(new Set(shoppingItemsWithNoAisles
      .filter(item => !item.location.aisle && item.location.section).
      map(x => x.location.section)));
    distinctSectionsWithNoAisles.forEach( section => this.sections.push(new SectionItems(section,
      shoppingItems.filter(shoppingItem => shoppingItem.location.section === section))));
    this.shoppingItems = shoppingItems.filter(item => !item.location.aisle && !item.location.section);
  }

  aisles: AisleItems[];
  id: number;
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
  shoppingLists: shoppingListAdapter.getInitialState(),
  loading: false,
  error: null
};

export function shoppingListManagementReducer(state = initialShoppingListManagementState,
                                              action: ShoppingActions): ShoppingListManagementState  {
  switch (action.type) {
    case ShoppingActionTypes.LoadShoppingListSucceeded: {
      return {
        ...state,
        shoppingLists: shoppingListAdapter.upsertOne( new ShoppingListState(action.storeId, action.shoppingList),
          state.shoppingLists),
      };
    }
    default: return state;
  }
}
