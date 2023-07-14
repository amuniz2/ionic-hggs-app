import {Inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  AppActions,
  AppActionTypes,
  DatabaseOpenFailed,
  FinishAppInitializer,
  LoadGroceryStoreAisles,
  LoadGroceryStoreSections,
  GroceryStoreAislesLoaded,
  LoadGroceryStoresFailed,
  StoresLoadedSuccessfully,
  StoreAisleAdded,
  AddStoreAisleFailed,
  GroceryStoreAisleDeleted,
  DeleteStoreAisleFailed,
  GroceryStoreSectionAdded,
  AddGroceryStoreSectionFailed,
  GroceryStoreSectionDeleted,
  DeleteGroceryStoreSectionFailed,
  GroceryStoreSectionsLoaded,
  DisplayError,
  LoadGroceryStoreLocations,
  LoadGroceryStores,
  LoadImportedData,
  GroceryStoresImportedSuccessfully, SelectStore, GroceryStoreLocationsLoaded
} from '../store/app.actions';
import {catchError, concatAll, map, switchMap, tap} from 'rxjs/operators';
import {AppState} from './app.state';
import {IPantryDataService} from '../services/IPantryDataService';
import {
  GetGroceryStoreLocationsFailed,
  GetStoreAislesFailed, GetStoreSectionsFailed
} from '../modules/store-management/store/store-management.actions';
import {forkJoin, of, throwError} from 'rxjs';
import {GroceryStoreState} from '../model/grocery-store';
import {
  LoadPantryItems,
  PantryImportedSuccessfully,
  PantryLoadedSuccessfully,
  PantryLoadFailed
} from '../modules/pantry-management/store/pantry-management.actions';
import {Router} from '@angular/router';

@Injectable()
export class AppEffects {
  constructor(private store: Store<AppState>,
              private actions$: Actions<AppActions>,
              @Inject('IPantryDataService') private storeManagementService: IPantryDataService) {
  }

  public openDatabase$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.StartAppInitializer),
    switchMap(() => {
      return this.storeManagementService.initialize().pipe(
        map((success) => {
          if (success) {
            console.log('Pantry Data Management Service is initialized.');
          } else {
            console.log('Pantry Data Management Service failed to initialize.');
            // throwError('Pantry Data Management Service failed to initialize.');
          }
          return new FinishAppInitializer();
        }),
        // map(data => new DatabaseOpenedSuccessfully({groceryStores: data})),
        catchError(error => [new DatabaseOpenFailed(error)])
      );
    })));

  public loadData = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.FinishAppInitializer),
    switchMap(() => {
        return [
          new LoadPantryItems(),
          new LoadGroceryStores()
        ];
      }
    )));

  public loadGroceryStores$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.LoadGroceryStores),
    tap(x => console.log('calling service getGroceryStores()')),
    tap(x => {
      if (this.storeManagementService === null) {
        console.log('storeManagementService not created/injected successfully');
      } else {
        console.log('storeManagementService created successfullty');
      }
    }),
    switchMap(() => {
      return this.storeManagementService.getGroceryStores().pipe(
        map(data => {
          const stateData: GroceryStoreState[] = data.map(x => {
                return {
                  ...x,
                  aisles: Array.from(x.aisles),
                  sections: Array.from(x.sections),
                };
          });
          return new StoresLoadedSuccessfully(stateData);
        }),
        catchError(error => [new LoadGroceryStoresFailed(error)])
      );
    })
  ));

  public loadGroceryStoresAislesAndSections$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.LocationGroceryStoreSelected),
    switchMap((payload) => {
      return [
        new SelectStore(payload.storeId),
        new LoadGroceryStoreAisles(payload.storeId),
        new LoadGroceryStoreSections(payload.storeId),
        new LoadGroceryStoreLocations(payload.storeId)
      ];
    })
  ));

  public getStoreLocations$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.LoadGroceryStoreLocations),
    switchMap((payload) => {
      return this.storeManagementService.getGroceryStoreLocations(payload.groceryStoreId).pipe(
        map(locations => new GroceryStoreLocationsLoaded( payload.groceryStoreId,
          locations)),
        catchError(error => [new GetGroceryStoreLocationsFailed(error)])
      );
    })));

  public getStoreAisles$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.LoadStoreAisles),
    switchMap((payload) => {
      return this.storeManagementService.getGroceryStoreAisles(payload.groceryStoreId).pipe(
        map(aisles => new GroceryStoreAislesLoaded( {
          groceryStoreId: payload.groceryStoreId,
          aisles: Array.from(aisles)
        })),
        catchError(error => [new GetStoreAislesFailed(error)])
      );
    })));

  public getGroceryStoreSections$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.LoacGroceryStoreSections),
    switchMap((payload) => {
      return this.storeManagementService.getGroceryStoreSections(payload.groceryStoreId).pipe(
        tap((sections) => {
          console.log(`sections: ${sections}`);
        }),
        map(sections => new GroceryStoreSectionsLoaded( {
          groceryStoreId: payload.groceryStoreId,
          sections: Array.from(sections)
        })),
        catchError(error => [new GetStoreSectionsFailed(error)])
      );
    })));

  public addNewStoreAisle$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.AddStoreAisle),
    switchMap((payload) => {
        return this.storeManagementService.addGroceryStoreAisle(payload.newStoreAisleRequest).pipe(
          map(aisleAdded => {
            return new StoreAisleAdded(
              {groceryStoreId: payload.newStoreAisleRequest.groceryStoreId, newAisle: aisleAdded});
          }),
          catchError(error => {
            return [new DisplayError(error)];
          })
        );
      })
    ));

  public deleteStoreAisle$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.DeleteStoreAisle),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStoreAisle(payload.deleteStoreAisleRequest).pipe(
        map(aisleDeleted => new GroceryStoreAisleDeleted( {
          groceryStoreId: payload.deleteStoreAisleRequest.groceryStoreId,
          aisle: payload.deleteStoreAisleRequest.name })),
        catchError(error => {
          return of(new DisplayError(error));
        }));
    })));

  public addNewGroceryStoreSection$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.AddGroceryStoreSection),
    switchMap((payload) => {
      return this.storeManagementService.addGroceryStoreSection(payload.newGroceryStoreSectionRequest).pipe(
        tap((sectionAdded) => {
          console.log(`sectionAdded: ${sectionAdded}`);
        }),
        map(sectionAdded => new GroceryStoreSectionAdded( {
          groceryStoreId: payload.newGroceryStoreSectionRequest.groceryStoreId,
          newSection: sectionAdded })),
        catchError(error => of(new DisplayError(error)))
      );
    })));

  public deleteGroceryStoreSection$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.DeleteGroceryStoreSection),
    switchMap((payload) => {
      return this.storeManagementService.deleteGroceryStoreSection({
        groceryStoreId: payload.deleteGroceryStoreSectionRequest.groceryStoreId,
        name: payload.deleteGroceryStoreSectionRequest.name}).pipe(
        map(sectionDeleted => new GroceryStoreSectionDeleted( {
          groceryStoreId: payload.deleteGroceryStoreSectionRequest.groceryStoreId,
          section: payload.deleteGroceryStoreSectionRequest.name })),
        catchError(error => [new DeleteGroceryStoreSectionFailed(error)])
      );
    })));

  public displayError$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.DisplayError),
    tap((payload) => {
      window.alert(payload.error);
    })
  ),
  { dispatch: false });

  public ImportData$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.ImportData),
    switchMap((payload) => {
      return this.storeManagementService.importHggsData(payload.data).pipe(
        switchMap(succeeded => [
          new LoadImportedData(payload.returnUrl),
        ]),
        catchError(error => {
          return of(new DisplayError(error));
        }));
    }),
  ));

  public loadImportedData$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.LoadImportedData),
    switchMap((payload) => {
      console.log('calling stateManagementService.getPantryItems()');
      return forkJoin([this.storeManagementService.getPantryItems(), this.storeManagementService.getGroceryStores()]).pipe(
        switchMap(([pantryItems, groceryStores]) => {
          return [
            new PantryImportedSuccessfully(pantryItems, payload.returnUrl),
            new GroceryStoresImportedSuccessfully(groceryStores, payload.returnUrl)
          ];
        }),
        catchError(error => [new PantryLoadFailed(error)])
      );
    })
  ));

  public databaseIsReady$ = createEffect(() => this.actions$.pipe(
    ofType(AppActionTypes.DatabaseReady),
    // todo: comment back in when  called from a button
    // switchMap(() => this.storeManagementService.cleanupLocations())
  ),
  { dispatch: false });
}
