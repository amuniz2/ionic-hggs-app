import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {AppState} from './app.state';
import {AppActions, AppActionTypes} from './app.actions';
import * as fromAppAdapter from './grocery-store.adapter';
import {getGroceryStore} from './store-management.selectors';
import {GroceryStoreState} from '../model/grocery-store';
import {ofType} from '@ngrx/effects';

export const reducers: ActionReducerMap<AppState> = {
  databaseReady: (databaseReady) => databaseReady,
  isReady: (isReady) => isReady,
  isDeviceReady: (isDeviceReady) => isDeviceReady,
  isPlatformReady: (isPlatformReady) => isPlatformReady,
  isOffline: (isOffline) => isOffline,
  version: (version) => version,
  initializationError: (error) => error,
  groceryStores: (groceryStores) => groceryStores,
  groceryItemLocations: (groceryStoreLocations) => groceryStoreLocations,
  // appReducer: appReducers
};

export const initialAppState: AppState = {
  isOffline: true,
  version: '1.0',
  isReady: false,
  isDeviceReady: false,
  isPlatformReady: false,
  databaseReady: false,
  initializationError: '',
  groceryStores: {
    ...fromAppAdapter.sharedGroceryStoreAdapter.getInitialState(),
    loading: false,
    error: null,
    selectedGroceryStore: null
  },
  groceryItemLocations: {
    ...fromAppAdapter.sharedGroceryStoreLocationAdapter.getInitialState(),
    loading: false,
    error: null
  }
};

export function appRootReducers(state: AppState = initialAppState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionTypes.DatabaseReady:
      return {
        ...state,
        databaseReady: true
      };

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
    {
      // const updateManyPayload: UpdateNum<GroceryStoreState>[] = action.groceryStores.map((groceryStore) => {
      //   return {
      //     id: groceryStore.id,
      //     changes: { name: groceryStore.name }
      //   };
      // });
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.addMany(action.groceryStores, state.groceryStores),
          loading: false,
          error: null
        },
      };
    }

    case AppActionTypes.GroceryStoresImportedSuccessfully:
    {
      const groceryStoresStateData: GroceryStoreState[] = action.groceryStores.map(x => {
        return {
        ...x,
        aisles: Array.from(x.aisles),
        sections: Array.from(x.sections),
      };
      });
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.addMany(groceryStoresStateData, state.groceryStores),
          loading: false,
          error: null
        },
      };
    }

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
      if (groceryStore.aisles.some(aisle => aisle === action.payload.newAisle)) {
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
      if (groceryStore.sections.some((section) => section === action.payload.newSection)) {
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
      const existingStoreLocations = state.groceryStores.entities[action.payload.storeId].locations;
      const existingStoreLocation = existingStoreLocations.find((loc) => loc.id === action.payload.id);
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne({
            id: action.payload.storeId,
            changes: {
              locations: [...existingStoreLocations, action.payload]
            }
          }, state.groceryStores)
        },
        groceryItemLocations: {
          ...fromAppAdapter.sharedGroceryStoreLocationAdapter.upsertOne(action.payload, state.groceryItemLocations),
          error: null,
        }
      };
    }

    case AppActionTypes.GroceryStoreLocationsLoaded: {
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.updateOne({
            id: action.groceryStoreId,
            changes: {
              locations: [...action.storeLocations]
            }
          }, state.groceryStores)
        },
        groceryItemLocations: {
          ...fromAppAdapter.sharedGroceryStoreLocationAdapter.upsertMany(action.storeLocations, state.groceryItemLocations),
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
      const groceryStoreState: GroceryStoreState = { ...action.groceryStore, aisles: [], sections: [] }
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.addOne(groceryStoreState, state.groceryStores),
          error: null,
          selectedGroceryStore: groceryStoreState
        },
      };
    }

    case AppActionTypes.StoreDeleted:
      // const { id, name } = action.payload;
      return {
        ...state,
        groceryStores: {
          ...fromAppAdapter.sharedGroceryStoreAdapter.removeOne(action.id, state.groceryStores),
          error: null
        },
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

    case AppActionTypes.SelectStore:
      const storeToSelect = getGroceryStore(state.groceryStores, action.id);
      return {
        ...state,
        groceryStores: {
          ...state.groceryStores,
          selectedGroceryStore: storeToSelect
        }
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
