import {ShoppingActions, ShoppingActionTypes} from './shopping.actions';
import {EntityState} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import {shoppingListAdapter} from './shopping.adapter';
import {sortAislesOrSections} from '../../../helpers';

export class SectionItems {
  name: string;
  items: ShoppingItem[];

  constructor(section: string, items: ShoppingItem[]) {
    this.name = section;
    this.items = items.filter((item) => item.location.section === this.name);
  }

  public findShoppingItem(pantryItemId: number): ShoppingItem {
    const result =  this.items.find(item => item.pantryItemId === pantryItemId);
    console.log(`returning: ${JSON.stringify(result)} for findShoppingItem() in section: ${this.name}`);
    return result;
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

    const distinctSectionItems = Array.from(new Set(itemsInAisleWithSection.map(x => x.location.section))).sort(sortAislesOrSections);

    distinctSectionItems.forEach( section => this.sections.push(new SectionItems(section,
      itemsInAisleWithSection.filter(shoppingItem => shoppingItem.location.section === section))));
  }

  public findShoppingItem(pantryItemId: number): ShoppingItem {
    let result = this.items.find(item => item.pantryItemId === pantryItemId);
    if (result == null) {
      const sectionWithItem = this.sections.find(section => section.findShoppingItem(pantryItemId));
      if (sectionWithItem) {
        result = sectionWithItem.findShoppingItem(pantryItemId);
      }
    }
    return result;
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

    const distinctAisles = Array.from(new Set(shoppingItems.filter(item => item.location.aisle).map(x => x.location.aisle))).sort(sortAislesOrSections);

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

  public findShoppingItem(pantryItemId: number): ShoppingItem {
    let result = this.shoppingItems.find(item => item.pantryItemId === pantryItemId);
    if (result == null) {
      const sectionWithItem = this.sections.find(section => section.findShoppingItem(pantryItemId));
      if (sectionWithItem) {
        result = sectionWithItem.findShoppingItem(pantryItemId);
      }
    }
    if (result == null) {
      const aisleWithItem = this.aisles.find(aisle => aisle.findShoppingItem(pantryItemId));
      if (aisleWithItem) {
        result = aisleWithItem.findShoppingItem(pantryItemId);
      }
    }
    return result;
  }

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
        shoppingLists: shoppingListAdapter.upsertOne(new ShoppingListState(action.storeId, action.shoppingList),
          state.shoppingLists),
      };
    }

    case ShoppingActionTypes.ShoppingItemUpdateSucceeded: {
      const shoppingList = state.shoppingLists.entities[action.storeId];
      const shoppingItem = shoppingList.findShoppingItem(action.id);
      console.log(`in reducer, action: ${JSON.stringify(action)}; shoppingList: ${JSON.stringify(shoppingList)}; shoppingItem: ${shoppingItem}`);
      shoppingItem.inCart = !shoppingItem.inCart;
      return {
        ...state,
        shoppingLists: shoppingListAdapter.upsertOne( shoppingList,
          state.shoppingLists),
      };
    }

    default: return state;
  }
}
