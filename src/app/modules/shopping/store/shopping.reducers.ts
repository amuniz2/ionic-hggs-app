import {ShoppingActions, ShoppingActionTypes} from './shopping.actions';
import {EntityState} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import {buildShopppingItemId, shoppingAdapter, ShoppingItemState} from './shopping.adapter';

// export class SectionItems {
//   name: string;
//   items: ShoppingItem[];
//
//   constructor(section: string, items: ShoppingItem[]) {
//     this.name = section;
//     this.items = items.filter((item) => item.location.section === this.name);
//   }
//
//   public findShoppingItem(pantryItemId: number): ShoppingItem {
//     const result =  this.items.find(item => item.pantryItemId === pantryItemId);
//     console.log(`returning: ${JSON.stringify(result)} for findShoppingItem() in section: ${this.name}`);
//     return result;
//   }
//
//   public updateShoppingItem(updatedItem: ShoppingItem): ShoppingItem[] {
//     const index = this.items.findIndex(item => item.pantryItemId === updatedItem.pantryItemId);
//     const result = [...this.items];
//     if (index >= 0) {
//       result.splice(index, 1, updatedItem);
//     }
//     return result;
//   }
// }

// export class AisleItems {
//   name: string;
//   sections: SectionItems[];
//   items: ShoppingItem[];
//
//   constructor(aisle: string, items: ShoppingItem[]) {
//     this.name = aisle;
//     this.sections = [];
//
//     const itemsInAisle = items.filter((item) => item.location.aisle === this.name);
//     this.items = itemsInAisle.filter(item => !!!item.location.section);
//     const itemsInAisleWithSection = itemsInAisle.filter(item => item.location.section);
//
//     const distinctSectionItems = Array.from(new Set(itemsInAisleWithSection.map(x => x.location.section))).sort(sortAislesOrSections);
//
//     distinctSectionItems.forEach(section => this.sections.push(new SectionItems(section,
//       itemsInAisleWithSection.filter(shoppingItem => shoppingItem.location.section === section))));
//   }

  // public findShoppingItem = (pantryItemId: number): ShoppingItem  => {
  //   let result = this.items.find(item => item.pantryItemId === pantryItemId);
  //   if (result == null) {
  //     const sectionWithItem = this.sections.find(section => section.findShoppingItem(pantryItemId));
  //     if (sectionWithItem) {
  //       result = sectionWithItem.findShoppingItem(pantryItemId);
  //     }
  //   }
  //   return result;
  // };

//   public updateShoppingItem(updatedItem: ShoppingItem) {
//     const index = this.items.findIndex(item => item.pantryItemId === updatedItem.pantryItemId);
//     if (index >= 0) {
//       this.items.splice(index, 1, updatedItem);
//       return;
//     }
//     const sectionWithItem = this.sections.find(section => section.findShoppingItem(updatedItem.pantryItemId));
//     if (sectionWithItem) {
//       sectionWithItem.updateShoppingItem(updatedItem);
//       return;
//     }
//   }
// }

export interface IStoreShoppingList {
  id: number;
  shoppingItems: ShoppingItem[];
}

// export class StoreShoppingList implements IStoreShoppingList {
//
//   constructor(storeId: number, shoppingItems: ShoppingItem[]) {
//     this.id = storeId;
//     this.aisles = [];
//     this.sections = [];
//
//     const distinctAisles = Array.from(new Set(shoppingItems.filter(item => item.location.aisle).map(x => x.location.aisle))).sort(sortAislesOrSections);
//
//     distinctAisles.forEach( aisle => this.aisles.push(new AisleItems(aisle,
//       shoppingItems.filter(shoppingItem => shoppingItem.location.aisle === aisle))));
//     const shoppingItemsWithNoAisles = shoppingItems.filter(item => !item.location.aisle);
//     const distinctSectionsWithNoAisles = Array.from(new Set(shoppingItemsWithNoAisles
//       .filter(item => !item.location.aisle && item.location.section).
//       map(x => x.location.section)));
//     distinctSectionsWithNoAisles.forEach( section => this.sections.push(new SectionItems(section,
//       shoppingItems.filter(shoppingItem => shoppingItem.location.section === section))));
//     this.shoppingItems = shoppingItems.filter(item => !item.location.aisle && !item.location.section);
//   }
//
//   id: number;
//   shoppingItems: ShoppingItem[];
//
//   public copyAndReplaceShoppingItem(updatedItem: ShoppingItem): StoreShoppingList {
//     const result = JSON.parse(JSON.stringify(this));
//     const index = result.findIndex(item => item.pantryItemId === updatedItem.pantryItemId);
//     if (index >= 0) {
//       result.splice(index, 1, updatedItem);
//       return result;
//     }
//     const sectionWithItem = result.sections.find(section => section.findShoppingItem(updatedItem.pantryItemId));
//     if (sectionWithItem) {
//       sectionWithItem.updateShoppingItem(updatedItem);
//       return result;
//     }
//     const aisleWithItem = result.aisles.find(aisle => aisle.findShoppingItem(updatedItem.pantryItemId));
//     if (aisleWithItem) {
//       aisleWithItem.updateShoppingItem(updatedItem);
//       return result;
//     }
//     return result;
//   }
//
//   public findShoppingItem(pantryItemId: number): ShoppingItem {
//     let result = this.shoppingItems.find(item => item.pantryItemId === pantryItemId);
//     if (result == null) {
//       const sectionWithItem = this.sections.find(section => section.findShoppingItem(pantryItemId));
//       if (sectionWithItem) {
//         result = sectionWithItem.findShoppingItem(pantryItemId);
//       }
//     }
//     if (result == null) {
//       const aisleWithItem = this.aisles.find(aisle => aisle.findShoppingItem(pantryItemId));
//       if (aisleWithItem) {
//         result = aisleWithItem.findShoppingItem(pantryItemId);
//       }
//     }
//     return result;
//   }
//
// }

// export class ShoppingListState {
//   constructor(storeId: number, list: ShoppingItem[]) {
//   }
// }

export interface ShoppingListManagementState {
  shoppingItems: EntityState<ShoppingItemState>;
  currentShoppingStoreId?: number;
  currentShoppingItemId?: string;
  loading: boolean;
  error: Error;
}

export const initialShoppingListManagementState: ShoppingListManagementState = {
  shoppingItems: shoppingAdapter.getInitialState(),
  loading: false,
  error: null
};

export function shoppingListManagementReducer(state = initialShoppingListManagementState,
                                              action: ShoppingActions): ShoppingListManagementState  {
  switch (action.type) {
    case ShoppingActionTypes.LoadShoppingListSucceeded: {
      const shoppingItemsState = action.shoppingList.map(item => new ShoppingItemState(item));
      return {
        ...state,
        currentShoppingStoreId: action.storeId,
        shoppingItems: shoppingAdapter.upsertMany(shoppingItemsState, state.shoppingItems),
        error: null,
        loading: false
      }
    }

    case ShoppingActionTypes.ShoppingItemUpdateSucceeded: {
        console.log('state before shoppingItemUpdateSucceeded:', state);
        const shoppingItemId = buildShopppingItemId(action.shoppingItem.storeId, action.shoppingItem.pantryItemId);
        const existingItemState = state.shoppingItems.entities[shoppingItemId];
        const newState = {
          ...state,
          currentShoppingItemId: shoppingItemId,
          shoppingItems: shoppingAdapter.updateOne
          ({
              id: shoppingItemId,
              changes: {
                shoppingItem: {
                  ...existingItemState.shoppingItem,
                  inCart: action.shoppingItem.inCart
                }
              }
          } ,
            state.shoppingItems)
        };
        console.log('state after shoppingItemUpdateSucceeded handled:', newState);
        return newState;
    }

    case ShoppingActionTypes.AddOrRemoveItemFromShoppingLists: {
      if (!state.currentShoppingStoreId) {
        return state;
      }
      const storeLocation = action.locations.find(location => location.storeId === state.currentShoppingStoreId);
      if (!storeLocation) {
        return state;
      }
      const shoppingItemId = buildShopppingItemId(state.currentShoppingStoreId, action.pantryItem.id);
      const currentShoppingItem = state.shoppingItems[shoppingItemId];
      let newState: ShoppingListManagementState;
      if (action.pantryItem.need) {
        newState = {
          ...state,
          shoppingItems: shoppingAdapter.upsertOne({
              id: shoppingItemId,
              shoppingItem: {
                pantryItemId: action.pantryItem.id,
                quantity: action.pantryItem.quantityNeeded,
                storeId: state.currentShoppingStoreId,
                inCart: false,
                description: action.pantryItem.description,
                name: action.pantryItem.name,
                units: action.pantryItem.units,
                location: {
                  locationId: storeLocation.id,
                  aisle: storeLocation.aisle,
                  section: storeLocation.section
                },
              }
            },
            state.shoppingItems)
        };
      } else {
        newState = {
          ...state,
          shoppingItems: shoppingAdapter.removeOne(shoppingItemId,
            state.shoppingItems)
        };
      }
      return newState;
    }

    default: return state;
  }
}
