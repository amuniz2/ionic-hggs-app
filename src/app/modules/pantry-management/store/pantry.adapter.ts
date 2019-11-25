import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {PantryItem} from '../../../model/pantry-item';

function sortByPantryItemName( item1: PantryItem, item2: PantryItem): number {
  return item1.name.localeCompare(item2.name);
}

export const pantryAdapter: EntityAdapter<PantryItem> = createEntityAdapter<PantryItem>({sortComparer: sortByPantryItemName});

export const {
  selectAll : selectAllPantryItems,
  selectEntities : selectPantryItemEntities,
  selectIds : selectPantryItemIds,
  selectTotal : pantryItemCount,
} = pantryAdapter.getSelectors();
