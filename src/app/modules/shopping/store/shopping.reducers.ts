import {ShoppingActions, ShoppingActionTypes} from './shopping.actions';
import {EntityState} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import {shoppingListAdapter} from './shopping.adapter';
import {isNumeric} from 'rxjs/internal-compatibility';

export class SectionItems {
  name: string;
  items: ShoppingItem[];
  constructor(section: string, items: ShoppingItem[]) {
    this.name = section;
    this.items = items.filter((item) => item.location.section === this.name);
  }
}

export class AisleItems {
  name: string;
  sections: SectionItems[];
  items: ShoppingItem[];

  constructor(aisle: string, items: ShoppingItem[]) {
    this.name = aisle;
    this.sections = [];

    const itemsInAisle = items.filter((item) => item.location.aisle === this.name);
    this.items = itemsInAisle.filter(item => !!!item.location.section);
    const itemsInAisleWithSection =  itemsInAisle.filter(item => item.location.section);

    const distinctSectionItems = Array.from(new Set(itemsInAisleWithSection.map(x => x.location.section))).sort((item1, item2) => {
      const item1IsNumeric = isNumeric(item1);
      const item2IsNumeric = isNumeric(item2);

      if (item1IsNumeric && item2IsNumeric) {
        const item1Num = Number(item1);
        const item2Num = Number(item2);
        return item1Num < item2Num ? -1 : item1Num > item2Num ? 1 : 0;
      } else {
        if (item1IsNumeric) {
          return -1;
        } else if (item2IsNumeric) {
          return 1;
        } else {
          return item1 < item2 ? -1 : item1 > item2 ? 1 : 0;
        }
      }
    });

    distinctSectionItems.forEach( section => this.sections.push(new SectionItems(section,
      itemsInAisleWithSection.filter(shoppingItem => shoppingItem.location.section === section))));
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

    const distinctAisles = Array.from(new Set(shoppingItems.filter(item => item.location.aisle).map(x => x.location.aisle))).sort((aisle1, aisle2) => {
      const aisle1IsNumeric = isNumeric(aisle1);
      const aisle2IsNumeric = isNumeric(aisle2);

      if (aisle1IsNumeric && aisle2IsNumeric) {
        const aisle1Num = Number(aisle1);
        const aisle2Num = Number(aisle2);
        return aisle1Num < aisle2Num ? -1 : aisle1Num > aisle2Num ? 1 : 0;
      } else {
        if (aisle1IsNumeric) {
          return -1;
        } else if (aisle2IsNumeric) {
          return 1;
        } else {
          return aisle1 < aisle2 ? -1 : aisle1 > aisle2 ? 1 : 0;
        }
      }
    });

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
      console.log(`Loading shopping list into state: ${JSON.stringify(action.shoppingList)}`)
      return {
        ...state,
        shoppingLists: shoppingListAdapter.upsertOne( new ShoppingListState(action.storeId, action.shoppingList),
          state.shoppingLists),
      };
    }

    case ShoppingActionTypes.ShoppingItemUpdateSucceeded: {
      const shoppingList = state.shoppingLists.entities[action.storeId].shoppingItems;
      const shoppingItem = shoppingList.find(i => i.pantryItemId === action.id);
      console.log(`in reducer, action: ${JSON.stringify(action)}; shoppingList: ${JSON.stringify(shoppingList)}; shoppingItem: ${shoppingItem}`);
      shoppingItem.inCart = !shoppingItem.inCart;
      return {
        ...state,
        shoppingLists: shoppingListAdapter.upsertOne( new ShoppingListState(action.storeId, shoppingList),
          state.shoppingLists),
      };
    }

    default: return state;
  }
}
