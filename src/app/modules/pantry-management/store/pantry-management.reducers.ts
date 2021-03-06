import * as fromAdapter from './pantry.adapter';
import {EntityState} from '@ngrx/entity';
import {PantryActions, PantryActionTypes} from './pantry-management.actions';
import {PantryItem} from '../../../model/pantry-item';
import {getPantryItem} from './pantry-management.selectors';
import {AppActions, AppActionTypes} from '../../../store';

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

export function pantryReducer(state = initialPantryManagementState, action: PantryActions | AppActions): PantryManagementState  {
    switch (action.type) {
      case PantryActionTypes.LoadPantryItems:
        return {
          ...state,
          pantryItems: {
            ...state.pantryItems,
            loading: true,
            error: null
          }
        };

      case AppActionTypes.LoadImportedData:
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

      case PantryActionTypes.PantryItemCreated: {
        // const { id, name } = action.payload;
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.addOne(action.pantryItem, state.pantryItems),
            error: null
          },
        };
      }

      case PantryActionTypes.PantryItemInfoScanned: {
        const pantryItem = getPantryItem(state.pantryItems, action.pantryItemId);
        let name = pantryItem.name;
        let description = pantryItem.description;
        if (!!name) {
          description = action.infoScanned[0].name;
        } else {
          name = action.infoScanned[0].name;
        }
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.updateOne({
              id: action.pantryItemId,
              changes: {
                name,
                description
              }
            }, state.pantryItems),
            error: null
          }
        };
      }

      case PantryActionTypes.SavePantryItemSucceeded: {
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.updateOne({
              id: action.pantryItem.id,
              changes: {
                name: action.pantryItem.name,
                description: action.pantryItem.description,
                need: action.pantryItem.need,
                defaultQuantity: action.pantryItem.defaultQuantity,
                units: action.pantryItem.units,
                quantityNeeded: action.pantryItem.quantityNeeded,
                inCart: action.pantryItem.inCart
              }
            }, state.pantryItems),
            error: null
          }
        };
      }

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

      case PantryActionTypes.PantryLoadedSuccessfully: {
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.addMany(action.pantryItems, state.pantryItems),
            loading: false,
            error: null
          },
        };
      }

      case PantryActionTypes.PantryImportedSuccessfully: {
        console.log('in pantry reducer, handling PantryImportedSuccessfully')
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.addMany(action.pantryItems, state.pantryItems),
            loading: false,
            error: null
          },
        };
      }

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

      case PantryActionTypes.PantryItemLocationDeleted:
      {
        const pantryItem = getPantryItem(state.pantryItems, action.itemId);
        return {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.updateOne({
              id: action.itemId,
              changes: {
                locations: pantryItem.locations.filter(itemLocation => itemLocation.id !== action.location.id)
              }
            }, state.pantryItems),
            error: null
          },
        };
      }

      case PantryActionTypes.PantryItemLocationAdded:
      {
        const pantryItem = getPantryItem(state.pantryItems, action.itemId);
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
          },
        };
      }

      case PantryActionTypes.PantryItemLocationUpdated:
      {
        const pantryItem = getPantryItem(state.pantryItems, action.itemId);
        const newState = {
          ...state,
          pantryItems: {
            ...fromAdapter.pantryAdapter.updateOne({
              id: action.itemId,
              changes: {
                locations: [
                  ...pantryItem.locations.filter(loc => loc.id !== action.originalLocationId),
                  action.pantryItemLocation]
              }
            }, state.pantryItems),
            error: null
          }
        };
        return newState;
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
      }

      case PantryActionTypes.AddPantryItemLocationFailed:
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
