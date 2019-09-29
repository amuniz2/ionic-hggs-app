import {StoreManagementActions, StoreManagerActionTypes} from './store-management.actions';
import * as fromAdapter from './grocery-store.adapter';
import {EntityState} from '@ngrx/entity';
import {GroceryStore} from '../model/grocery-store';
// export interface GroceryStoreAisle {
//   aisle: string;
//   storeId: number;
// }
//
// export interface GroceryStoreSection {
//   section: string;
//   storeId: number;
// }
export interface GroceryStoresState extends EntityState<GroceryStore> {
  loading: boolean;
  error: Error;
}

export interface StoreManagementState {
  selectedGroceryStoreId: number | null;
  groceryStores: GroceryStoresState;
}

export const initialStoreManagementState: StoreManagementState = {
  selectedGroceryStoreId: null,
  groceryStores: {
    ...fromAdapter.groceryStoreAdapter.getInitialState(),
    loading: false,
    error: null
  }
};

export function groceryStoresReducer(state = initialStoreManagementState, action: StoreManagementActions): StoreManagementState  {
    switch (action.type) {
      case StoreManagerActionTypes.NavigatedToStoreListPage:
        return {
          ...state,
          groceryStores: {
            ...state.groceryStores,
            loading: true,
            error: null
          }
        };

      case StoreManagerActionTypes.StoreCreated: {
        // const { id, name } = action.payload;
        console.log('reducing state after StoreCreated. payload: ');
        console.log(action.payload);
        return {
          ...state,
          groceryStores: {
            ...fromAdapter.groceryStoreAdapter.addOne(action.payload, state.groceryStores),
            error: null
          },
        };
      }

      case StoreManagerActionTypes.StoreDeleted:
        // const { id, name } = action.payload;
        return {
          ...state,
          groceryStores: {
            ...fromAdapter.groceryStoreAdapter.removeOne(action.id, state.groceryStores),
            error: null
          },
          // selectedGroceryStoreId:
        };

      case StoreManagerActionTypes.DeleteStoreFailed:
        // const { id, name } = action.payload;
        return {
          ...state,
          groceryStores: {
            ...state.groceryStores,
            error: action.error
          },
          // selectedGroceryStoreId:
        };

      case StoreManagerActionTypes.CreateStoreFailed:
        return {
          ...state,
          groceryStores: {
            ...state.groceryStores,
            loading: false,
            error: action.error
          },
        };

      case StoreManagerActionTypes.StoresLoadedSuccessfully:
        return {
          ...state,
          groceryStores: {
            ...fromAdapter.groceryStoreAdapter.addAll(action.groceryStores, state.groceryStores),
            loading: false,
            error: null
          },
        };

      case StoreManagerActionTypes.LoadGroceryStoresFailed:
        return {
          ...state,
          groceryStores: {
            ...state.groceryStores,
            loading: false,
            error: action.error
          },
        };

      case StoreManagerActionTypes.StoreAisleAdded:
        // const { id, name } = action.payload;
      {
        return {
          ...state,
          groceryStores: fromAdapter.groceryStoreAdapter.updateOne(
            {
              changes: {aisles: action.payload.aisles},
              id: action.payload.id
            }, state.groceryStores)
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
