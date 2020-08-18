import {EntityState} from '@ngrx/entity';
import {GroceryStore, GroceryStoreState} from '../model/grocery-store';
import {GroceryStoreLocation} from '../model/grocery-store-location';

export interface GroceryStoresState extends EntityState<GroceryStoreState> {
  loading: boolean;
  error: Error;
  selectedGroceryStore: GroceryStoreState;
}

export interface GroceryItemLocationsState extends EntityState<GroceryStoreLocation> {
  loading: boolean;
  error: Error;
}

export interface AppState {
  isReady: boolean;
  isPlatformReady: boolean;
  isDeviceReady: boolean;
  databaseReady: boolean;
  isOffline: boolean;
  version: string;
  initializationError: string;
  groceryStores: GroceryStoresState;
  groceryItemLocations: GroceryItemLocationsState;
  // appReducer: (AppState, AppActions) => AppState;
  // storeManagementState: StoreManagementState;
}

export interface State {
  app: AppState;
}
