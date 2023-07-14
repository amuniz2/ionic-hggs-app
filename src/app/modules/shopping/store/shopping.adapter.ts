import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {ShoppingItem} from '../../../model/shopping-item';
import {sortAislesOrSections} from '../../../helpers';

function sortByLocation( item1: ShoppingItem, item2: ShoppingItem): number {
  return 0;
}

export const buildShopppingItemId = (storeId, pantryItemId) => `S${storeId}_P${pantryItemId}`;

function sortShoppingItemsByLocation( item1: ShoppingItemState, item2: ShoppingItemState): number {

  // sort by location in store
  if (item1.shoppingItem.storeId !== item2.shoppingItem.storeId) {
    return item1.shoppingItem.storeId - item2.shoppingItem.storeId;
  }

  if (item1.shoppingItem.location?.aisle !== item2.shoppingItem.location?.aisle) {
    return sortAislesOrSections(item1.shoppingItem.location?.aisle, item2.shoppingItem.location?.aisle);
  }

  if (item1.shoppingItem.location.section !== item2.shoppingItem.location.aisle) {
    return sortAislesOrSections(item1.shoppingItem.location?.section, item2.shoppingItem.location?.section);
  }

  return item1.shoppingItem.name < item2.shoppingItem.name ? -1 : item1.shoppingItem.name > item2.shoppingItem.name ? 1 : 0;
}

export const shoppingAdapter: EntityAdapter<ShoppingItemState> = createEntityAdapter<ShoppingItemState>({sortComparer: sortShoppingItemsByLocation});

export class ShoppingItemState {
  public id: string;
  public shoppingItem: ShoppingItem;

  constructor(shoppingItem: ShoppingItem) {
    this.id = buildShopppingItemId(shoppingItem.storeId, shoppingItem.pantryItemId);
    this.shoppingItem = {
      ...shoppingItem,
      location: {
      ...shoppingItem.location
    }};
  }
}

// export const shoppingListAdapter: EntityAdapter<ShoppingItemState> =
//   createEntityAdapter<ShoppingItemState>({sortComparer: sortShoppingItemsByLocation});

// export const {
//   selectAll : selectAllShoppingLists,
//   selectEntities : selectShoppingListEntities,
//   selectIds : selectShoppingListIds,
//   selectTotal : shoppingListCount,
// } = shoppingListAdapter.getSelectors();

export const {
  selectAll : selectAllShoppingItems,
  selectEntities : selectShoppingItemEntities,
  selectIds : selectShoppingItemIds,
  selectTotal : shoppingItemCount,
} = shoppingAdapter.getSelectors();
