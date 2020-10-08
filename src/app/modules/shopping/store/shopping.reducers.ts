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

  public updateShoppingItem(updatedItem: ShoppingItem): ShoppingItem[] {
    const index = this.items.findIndex(item => item.pantryItemId === updatedItem.pantryItemId);
    const result = [...this.items];
    if (index >= 0) {
      result.splice(index, 1, updatedItem);
    }
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
    const itemsInAisleWithSection = itemsInAisle.filter(item => item.location.section);

    const distinctSectionItems = Array.from(new Set(itemsInAisleWithSection.map(x => x.location.section))).sort(sortAislesOrSections);

    distinctSectionItems.forEach(section => this.sections.push(new SectionItems(section,
      itemsInAisleWithSection.filter(shoppingItem => shoppingItem.location.section === section))));
  }

  public findShoppingItem = (pantryItemId: number): ShoppingItem  => {
    let result = this.items.find(item => item.pantryItemId === pantryItemId);
    if (result == null) {
      const sectionWithItem = this.sections.find(section => section.findShoppingItem(pantryItemId));
      if (sectionWithItem) {
        result = sectionWithItem.findShoppingItem(pantryItemId);
      }
    }
    return result;
  };

  public updateShoppingItem(updatedItem: ShoppingItem) {
    const index = this.items.findIndex(item => item.pantryItemId === updatedItem.pantryItemId);
    if (index >= 0) {
      this.items.splice(index, 1, updatedItem);
      return;
    }
    const sectionWithItem = this.sections.find(section => section.findShoppingItem(updatedItem.pantryItemId));
    if (sectionWithItem) {
      sectionWithItem.updateShoppingItem(updatedItem);
      return;
    }
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

  public copyAndReplaceShoppingItem(updatedItem: ShoppingItem): StoreShoppingList {
    const result = JSON.parse(JSON.stringify(this));
    const index = result.findIndex(item => item.pantryItemId === updatedItem.pantryItemId);
    if (index >= 0) {
      result.splice(index, 1, updatedItem);
      return result;
    }
    const sectionWithItem = result.sections.find(section => section.findShoppingItem(updatedItem.pantryItemId));
    if (sectionWithItem) {
      sectionWithItem.updateShoppingItem(updatedItem);
      return result;
    }
    const aisleWithItem = result.aisles.find(aisle => aisle.findShoppingItem(updatedItem.pantryItemId));
    if (aisleWithItem) {
      aisleWithItem.updateShoppingItem(updatedItem);
      return result;
    }
    return result;
  }

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
      const currentShoppingList: ShoppingListState = state.shoppingLists.entities[action.storeId];
      const updatedShoppingItem = action.shoppingItem;
      if (currentShoppingList) {
        console.log('ShoppingList');
        console.log(currentShoppingList);
        const updatedShoppingList = currentShoppingList.copyAndReplaceShoppingItem(updatedShoppingItem);
        // currentShoppingList.findShoppingItem(action.shoppingItem.pantryItemId);
        return {
          ...state,
          shoppingLists: shoppingListAdapter.upsertOne({ id: action.storeId, loading: false, error: null, updatedShoppingList},
            state.shoppingLists),
        };
      } else {
        console.log('no shopping list in reducer')
      }
      console.log(`in reducer, action: ${JSON.stringify(action)};`,
        `shoppingList: ${JSON.stringify(currentShoppingList)}; shoppingItem: ${JSON.stringify(updatedShoppingItem)}`);
      // updatedShoppingItem.inCart = !updatedShoppingItem.inCart;
      return state;
    }

    default: return state;
  }
}
