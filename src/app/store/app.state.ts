import {EntityState} from '@ngrx/entity';
import {GroceryStore} from '../model/grocery-store';

export interface GroceryStoresState extends EntityState<GroceryStore> {
  loading: boolean;
  error: Error;
}
export interface AppState {
  isReady: boolean;
  isOffline: boolean;
  deviceDetails: any;
  version: string;
  initializationError: string;
  groceryStores: GroceryStoresState;
  // appReducer: (AppState, AppActions) => AppState;
  // storeManagementState: StoreManagementState;
}

export interface State {
  app: AppState;
}
