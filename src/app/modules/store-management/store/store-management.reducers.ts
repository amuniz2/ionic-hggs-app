import {StoreManagementActions, StoreManagerActionTypes} from './store-management.actions';
import * as fromAppAdapter from '../../../store/grocery-store.adapter';
import {getGroceryStore} from '../../../store/store-management.selectors';
import {AppState} from '../../../store/app.state';
import {initialAppState} from '../../../store/app.reducers';
// export interface GroceryStoreAisle {
//   aisle: string;
//   storeId: number;
// }
//
// export interface GroceryStoreSection {
//   section: string;
//   storeId: number;
// }

export interface StoreManagementState {
  selectedGroceryStoreId: number | null;
  // groceryStores: GroceryStoresState;
}

export const initialGroceryStoreManagementState: StoreManagementState = {
  selectedGroceryStoreId: null,
};

export function groceryStoresReducer(state = initialGroceryStoreManagementState, action: StoreManagementActions): StoreManagementState  {
    switch (action.type) {
      // case StoreManagerActionTypes.LoadGroceryStores:
      //   return {
      //     ...state,
      //     groceryStores: {
      //       ...state.groceryStores,
      //       loading: true,
      //       error: null
      //     }
      //   };

      case StoreManagerActionTypes.StoreCreated: {
        // const { id, name } = action.payload;
        return {
          ...state,
          // groceryStores: {
          //   ...fromAppAdapter.sharedGroceryStoreAdapter.addOne(action.groceryStore, state.groceryStores),
          //   error: null
          // },
        };
      }

      case StoreManagerActionTypes.StoreDeleted:
        // const { id, name } = action.payload;
        return {
          ...state,
          // groceryStores: {
          //   ...fromAppAdapter.sharedGroceryStoreAdapter.removeOne(action.id, state.groceryStores),
          //   error: null
          // },
          // selectedGroceryStoreId:
        };

      case StoreManagerActionTypes.DeleteStoreFailed:
        // const { id, name } = action.payload;
        return {
          ...state,
          // groceryStores: {
          //   ...state.groceryStores,
          //   error: action.error
          // },
          // selectedGroceryStoreId:
        };

      case StoreManagerActionTypes.CreateStoreFailed:
        return {
          ...state,
          // groceryStores: {
          //   ...state.groceryStores,
          //   loading: false,
          //   error: action.error
          // },
        };

      case StoreManagerActionTypes.NavigatedToStoreDetailsPage:
        return {
          ...state,
          selectedGroceryStoreId: action.groceryStoreId
        };

      default: return state;
    }

}
