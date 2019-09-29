import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {AppState} from './app.state';
import {AppActions, AppActionTypes} from './app.actions';
// import {appReducers} from '../app.reducers';

export const reducers: ActionReducerMap<AppState> = {
  isReady: (isReady) => isReady,
  isOffline: (isOffline) => isOffline,
  version: (version) => version,
  deviceDetails: (deviceDetails) => deviceDetails,
  initializationError: (error) => error,
  // appReducer: appReducers
};

export const initialAppState: AppState = {
  isOffline: true,
  deviceDetails: {},
  version: '1.0',
  isReady: false,
  initializationError: ''
};

export function appRootReducers(state: AppState = initialAppState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionTypes.FinishAppInitializer:
      return {
        ...state,
        isReady: true,
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
