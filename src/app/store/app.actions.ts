import {Action} from '@ngrx/store';

export const APP_READY = '[App] Ready';

export class AppReady implements Action {
  readonly type = APP_READY;
}
export enum AppActionTypes {
  StartAppInitializer = '[AppActionTypes] Start App Initializer',
  FinishAppInitializer = '[AppActionTypes] Finish App Initializer'
}
export class StartAppInitializer implements Action {
  public readonly type = AppActionTypes.StartAppInitializer;
}

export class FinishAppInitializer implements Action {
  public readonly type = AppActionTypes.FinishAppInitializer;
}

export type AppActions = AppReady | StartAppInitializer | FinishAppInitializer;


