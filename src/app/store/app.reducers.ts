import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {AppState} from './app.state';
import {AppActions, AppActionTypes} from './app.actions';
import * as fromAppAdapter from './grocery-store.adapter';
import {getGroceryStore} from './store-management.selectors';

export const reducers: ActionReducerMap<AppState> = {
  isReady: (isReady) => isReady,
  isOffline: (isOffline) => isOffline,
  version: (version) => version,
  deviceDetails: (deviceDetails) => deviceDetails,
  initializationError: (error) => error,
  groceryStores: (groceryStores) => groceryStores,
  groceryItemLocations: (groceryStoreLocations) => groceryStoreLocations,
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
  },
  groceryItemLocations: {
    ...fromAppAdapter.sharedGroceryStoreLocationAdapter.getInitialState(),
    loading: false,
    error: null
  }
};

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
      if (groceryStore.aisles.find((aisle) => aisle === action.payload.newAisle) !== null) {
        return state;
      }
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
      if (groceryStore.sections.find((section) => section === action.payload.newSection) !== null) {
        return state;
      }
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

    case AppActionTypes.GroceryStoreLocationPossiblyAdded: {
      return {
        ...state,
        groceryItemLocations: {
          ...fromAppAdapter.sharedGroceryStoreLocationAdapter.upsertOne(action.payload, state.groceryItemLocations),
          error: null,
        }
      };
    }
    //   const existingLocation = getGroceryStoreLocation(state.groceryItemLocations, action.payload.id);
    // //   if (existingLocation == null) {
    //     return {
    //       ...state,
    //       groceryItemLocations: {
    //         ...fromAppAdapter.sharedGroceryStoreLocationAdapter.upsertOne(action.payload, state.groceryItemLocations),
    //         error: null,
    //       }
    //     };
    //   } else {
    //     return state;
    //   }
    // }

    case AppActionTypes.StoreCreated: {
      // const { id, name } = action;
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.addOne(action.groceryStore, state.groceryStores),
          error: null
        },
      };
    }

    case AppActionTypes.StoreDeleted:
      // const { id, name } = action.payload;
      return {
        ...state,
        // groceryStores: {
        //   ...fromAppAdapter.sharedGroceryStoreAdapter.removeOne(action.id, state.groceryStores),
        //   error: null
        // },
        // selectedGroceryStoreId:
      };

    case AppActionTypes.DeleteStoreFailed:
      // const { id, name } = action.payload;
      return {
        ...state,
        // groceryStores: {
        //   ...state.groceryStores,
        //   error: action.error
        // },
        // selectedGroceryStoreId:
      };

    case AppActionTypes.CreateStoreFailed:
      return {
        ...state,
        // groceryStores: {
        //   ...state.groceryStores,
        //   loading: false,
        //   error: action.error
        // },
      };
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
