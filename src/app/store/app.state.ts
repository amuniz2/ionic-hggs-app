
export interface AppState {
  isReady: boolean;
  isOffline: boolean;
  deviceDetails: any;
  version: string;
  initializationError: string;
  // appReducer: (AppState, AppActions) => AppState;
  // storeManagementState: StoreManagementState;
}

export interface State {
  app: AppState;
}
