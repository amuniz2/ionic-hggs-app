import {Action} from '@ngrx/store';
import {error} from 'selenium-webdriver';

export const APP_READY = '[App] Ready';

export class AppReady implements Action {
  readonly type = APP_READY;
}
export enum AppActionTypes {
  StartAppInitializer = '[AppActionTypes] Start App Initializer',
  FinishAppInitializer = '[AppActionTypes] Finish App Initializer',
  DatabaseOpenFailed = '[AppActionTypes] Failed to open database',
  DatabaseReady = '[AppActionTypes] Database initialized'
}

export class StartAppInitializer implements Action {
  public readonly type = AppActionTypes.StartAppInitializer;
}

export class FinishAppInitializer implements Action {
  public readonly type = AppActionTypes.FinishAppInitializer;
}

export class DatabaseOpenFailed implements Action {
  public readonly type = AppActionTypes.DatabaseOpenFailed;
  constructor(err: any) {}
}

export class DatabaseReady implements Action {
  public readonly type = AppActionTypes.DatabaseReady;
  constructor(err: any) {}
}

export type AppActions = AppReady | StartAppInitializer | FinishAppInitializer | DatabaseOpenFailed;


