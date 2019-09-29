import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  AppActions, AppActionTypes, DatabaseOpenFailed, FinishAppInitializer
} from '../store/app.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {AppState} from './app.state';
import {IPantryDataService} from '../services/IPantryDataService';

@Injectable()
export class AppEffects {
  constructor(private store: Store<AppState>,
              private actions$: Actions<AppActions>,
              private storeManagementService: IPantryDataService) {
  }

  @Effect()
  public openDatabase$ = this.actions$.pipe(
    ofType(AppActionTypes.StartAppInitializer),
    switchMap(() => {
      return this.storeManagementService.initialize().pipe(
        map((success) => new FinishAppInitializer()),
        // map(data => new DatabaseOpenedSuccessfully({groceryStores: data})),
        catchError(error => [new DatabaseOpenFailed(error)])
      );
    }));
}
