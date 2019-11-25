import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {AppState} from './app.state';
import {AppActions, AppActionTypes} from './app.actions';
import * as fromAppAdapter from './grocery-store.adapter';
import {StoreManagerActionTypes} from '../modules/store-management/store/store-management.actions';
import {sharedGroceryStoreAdapter} from './grocery-store.adapter';
import {getGroceryStore} from './store-management.selectors';
// import {appReducers} from '../app.reducers';

export const reducers: ActionReducerMap<AppState> = {
  isReady: (isReady) => isReady,
  isOffline: (isOffline) => isOffline,
  version: (version) => version,
  deviceDetails: (deviceDetails) => deviceDetails,
  initializationError: (error) => error,
  groceryStores: (groceryStores) => groceryStores
  // appReducer: appReducers
};

export const initialAppState: AppState = {
  isOffline: true,
  deviceDetails: {},
  version: '1.0',
  isReady: false,
  initializationError: '',
  groceryStores: {
  ...fromAppAdapter.sharedGroceryStoreAdapter.getInitialState(),
  loading: false,
  error: null
}};

export function appRootReducers(state: AppState = initialAppState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionTypes.FinishAppInitializer:
      return {
        ...state,
        isReady: true,
      };
    case AppActionTypes.LoadGroceryStores:
      return {
        ...state,
        groceryStores: {
          ...state.groceryStores,
          loading: true,
          error: null
        }
      };
    case AppActionTypes.StoresLoadedSuccessfully:
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.addAll(action.groceryStores, state.groceryStores),
          loading: false,
          error: null
        },
      };

    case AppActionTypes.LoadGroceryStoresFailed:
      return {
        ...state,
        groceryStores: {
          ...state.groceryStores,
          loading: false,
          error: action.error
        },
      };

    case AppActionTypes.GroceryStoreAislesLoaded:
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne(
            {
              changes: {
                aisles: action.payload.aisles
              },
              id: action.payload.groceryStoreId,
            }, state.groceryStores),
          loading: false,
          error: null
        },
      };

    case AppActionTypes.GroceryStoreSectionsLoaded:
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne(
            {
              changes: {
                sections: action.payload.sections
              },
              id: action.payload.groceryStoreId,
            }, state.groceryStores),
          loading: false,
          error: null
        },
      };

    case AppActionTypes.StoreAisleAdded: {
      const groceryStore = getGroceryStore(state.groceryStores, action.payload.groceryStoreId);
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne(
            {
              changes: {
                aisles: [
                  ...groceryStore.aisles,
                  action.payload.newAisle
                ]
              },
              id: action.payload.groceryStoreId,
            }, state.groceryStores),
          loading: false,
          error: null
        },
      };
    }

    case AppActionTypes.GroceryStoreSectionAdded: {
      const groceryStore = getGroceryStore(state.groceryStores, action.payload.groceryStoreId);
      console.log(`grocery store in reducer: ${JSON.stringify(groceryStore)}`);
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne(
            {
              changes: {
                sections: [
                  ...groceryStore.sections,
                  action.payload.newSection
                ]
              },
              id: action.payload.groceryStoreId,
            }, state.groceryStores),
          loading: false,
          error: null
        },
      };
    }

    case AppActionTypes.GroceryStoreAisleDeleted: {
      const groceryStore = getGroceryStore(state.groceryStores, action.payload.groceryStoreId);
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne(
            {
              changes: {
                aisles:  groceryStore.aisles.filter(item => item !== action.payload.aisle)
              },
              id: action.payload.groceryStoreId,
            }, state.groceryStores),
          loading: false,
          error: null
        },
      };
    }


    case AppActionTypes.GroceryStoreSectionsLoaded: {
      const groceryStore = getGroceryStore(state.groceryStores, action.payload.groceryStoreId);
      console.log(`grocery store in reducer: ${groceryStore}`);
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne(
            {
              changes: {
                sections: action.payload.sections
              },
              id: action.payload.groceryStoreId,
            }, state.groceryStores),
          loading: false,
          error: null
        },
      };
    }


    case AppActionTypes.GroceryStoreSectionDeleted: {
      const groceryStore = getGroceryStore(state.groceryStores, action.payload.groceryStoreId);
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne(
            {
              changes: {
                sections:  groceryStore.sections.filter(item => item !== action.payload.section)
              },
              id: action.payload.groceryStoreId,
            }, state.groceryStores),
          loading: false,
          error: null
        },
      };
    }
    default: return state;
  }
}

// export function reducer(state = initialState, action: fromApp.AppActions): AppState {
//   switch (action.type) {
//     case fromApp.APP_READY:
//       const { id, name } = action.payload;
//       return {
//
//         stores: [
//           ...state.stores,
//           { id, name, aisles: [], sections: [], locations: [] }
//         ]
//       };
//   }
// }

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
