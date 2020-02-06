import * as fromAdapter from './pantry.adapter';
import {EntityState} from '@ngrx/entity';
import {PantryActions, PantryActionTypes} from './pantry-management.actions';
import {PantryItem} from '../../../model/pantry-item';
import {from} from 'rxjs';
import {getPantryItem} from './pantry-management.selectors';
// export interface GroceryStoreAisle {
//   aisle: string;
//   storeId: number;
// }
//
// export interface GroceryStoreSection {
//   section: string;
//   storeId: number;
// }
export interface PantryState extends EntityState<PantryItem> {
  loading: boolean;
  error: Error;
}

export interface PantryManagementState {
  selectedPantryItemId: number | null;
  pantryItems: PantryState;
}

export const initialPantryManagementState: PantryManagementState = {
  selectedPantryItemId: null,
  pantryItems: {
    ...fromAdapter.pantryAdapter.getInitialState(),
    loading: false,
    error: null
  }
};

export function pantryReducer(state = initialPantryManagementState, action: PantryActions): PantryManagementState  {
    switch (action.type) {
      case PantryActionTypes.NavigatedToPantryPage:
        return {
          ...state,
          pantryItems: {
            ...state.pantryItems,
            loading: true,
            error: null
          }
        };

      case PantryActionTypes.PantryItemLoaded:
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.updateOne({
              id: action.pantryItem.id,
              changes: {
                name: action.pantryItem.name,
                description: action.pantryItem.description,
              }
            }, state.pantryItems),
            loading: false,
            error: null
          }
        };

      case PantryActionTypes.ItemCreated: {
        // const { id, name } = action.payload;
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.addOne(action.pantryItem, state.pantryItems),
            error: null
          },
        };
      }

      case PantryActionTypes.SavePantryItemSucceeded:
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.updateOne({
              id: action.pantryItem.id,
              changes: {
                name: action.pantryItem.name,
                description: action.pantryItem.description
              }
              }, state.pantryItems),
            error: null
          }
        };

      case PantryActionTypes.PantryItemDeleted:
        // const { id, name } = action.payload;
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.removeOne(action.id, state.pantryItems),
            error: null
          },
          // selectedGroceryStoreId:
        };

      case PantryActionTypes.DeletePantryItemFailed:
        // const { id, name } = action.payload;
        return {
          ...state,
          pantryItems: {
            ...state.pantryItems,
            error: action.error
          },
        };

      case PantryActionTypes.CreateItemFailed:
        return {
          ...state,
          pantryItems: {
            ...state.pantryItems,
            loading: false,
            error: action.error
          },
        };

      case PantryActionTypes.SavePantryItemFailed:
        return {
          ...state,
          pantryItems: {
            ...state.pantryItems,
            loading: false,
            error: action.error
          },
        };

      case PantryActionTypes.PantryLoadedSuccessfully:
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.addAll(action.pantryItems, state.pantryItems),
            loading: false,
            error: null
          },
        };

      case PantryActionTypes.PantryLoadFailed:
        return {
          ...state,
          pantryItems: {
            ...state.pantryItems,
            loading: false,
            error: action.error
          },
        };

      case PantryActionTypes.NavigatedToPantryItemPage:
        return {
          ...state,
          selectedPantryItemId: action.pantryItemId
        };

      case PantryActionTypes.PantryItemLocationAdded:
      {
        const pantryItem = getPantryItem(state.pantryItems, action.itemId);
        console.log('in PantryItemLocationAdded reducer');
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.updateOne({
              id: action.itemId,
              changes: {
                locations: [
                  ...pantryItem.locations,
                  action.pantryItemLocation]
              }
            }, state.pantryItems),
            error: null
          }
        };
      }
      case PantryActionTypes.PantryItemLocationsLoadedSuccessfully:
      {
        const pantryItem = getPantryItem(state.pantryItems, action.itemId);
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.updateOne({
              id: action.itemId,
              changes: {
                locations: [
                  ...action.locations
                ]
              }
            }, state.pantryItems),
            error: null
          }
        };
      }      case PantryActionTypes.AddPantryItemLocationFailed:
      {
        return {
          ...state,
          pantryItems: {
            ...state.pantryItems,
            error: action.error
          }
        };
      }
      default: return state;
    }

}

// const manageGroceryStoresFeatureState = createFeatureSelector<StoreManagementState>('storeManagementState');
//
// export const getGroceryStores = createSelector(
//   manageGroceryStoresFeatureState,
//   state => state.groceryStoresState
// );
