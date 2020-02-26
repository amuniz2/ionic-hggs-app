import {StoreManagementActions, StoreManagerActionTypes} from './store-management.actions';

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
      case StoreManagerActionTypes.NavigatedToStoreDetailsPage:
        return {
          ...state,
          selectedGroceryStoreId: action.groceryStoreId
        };

      default: return state;
    }

}
