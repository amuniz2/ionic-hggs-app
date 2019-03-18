import {StoreManagementActions, StoreManagerActionTypes} from './store-management.actions';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromAdapter from './grocery-store.adapter';
import {EntityState} from '@ngrx/entity';
import {GroceryStore} from '../model/grocery-store';
import {selectGroceryStore} from './store-management.selectors';
import {from, of, pipe} from 'rxjs';
// export interface GroceryStoreAisle {
//   aisle: string;
//   storeId: number;
// }
//
// export interface GroceryStoreSection {
//   section: string;
//   storeId: number;
// }
export interface GroceryStoresState extends EntityState<GroceryStore> {}

export interface StoreManagementState {
  selectedGroceryStoreId: number | null;
  groceryStores: GroceryStoresState;
}

export const initialStoreManagementState: StoreManagementState = {
  selectedGroceryStoreId: null,
  groceryStores: fromAdapter.groceryStoreAdapter.getInitialState()
};

export function groceryStoresReducer(state = initialStoreManagementState, action: StoreManagementActions): StoreManagementState  {
    switch (action.type) {
      case StoreManagerActionTypes.NavigatedToStoreListPage:
        return {
          ...state
        };

      case StoreManagerActionTypes.StoreCreated:
        // const { id, name } = action.payload;
        return {
          ...state,
          groceryStores: fromAdapter.groceryStoreAdapter.addOne(action.payload, state.groceryStores),
          // selectedGroceryStoreId:
        };

      case StoreManagerActionTypes.StoreDeleted:
        // const { id, name } = action.payload;
        return {
          ...state,
          groceryStores: fromAdapter.groceryStoreAdapter.removeOne(action.payload.id, state.groceryStores),
          // selectedGroceryStoreId:
        };
      case StoreManagerActionTypes.StoresLoadedSuccessfully:
        // return {
        //   ...state,
        //   groceryStoresState: fromAdapter.groceryStoreAdapter.addAll(action.payload, state.groceryStoresState)
        // };
        return {
          ...state,
          groceryStores: fromAdapter.groceryStoreAdapter.addAll(action.payload.groceryStores, state.groceryStores)
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
export const getStoreManagementState = createFeatureSelector<StoreManagementState>('storeManagement');

export const getGroceryStoresState = createSelector(
  getStoreManagementState,
  (state: StoreManagementState) => state.groceryStores
);

export const selectGroceryStoreEntities = createSelector(
  getGroceryStoresState,
  fromAdapter.selectGroceryStoreEntities
);

export const selectGroceryStoreIds = createSelector(
  getGroceryStoresState,
  fromAdapter.selectGroceryStoreIds
);

export const selectGroceryStoreCount = createSelector(
  getGroceryStoresState,
  fromAdapter.groceryStoreCount
);
