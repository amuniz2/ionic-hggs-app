import {Inject, Injectable} from '@angular/core';
import {
  AddPantryItemLocationFailed,
  AddPantryItemLocationRequest,
  CreateItemFailed,
  EditPantryItemLocationRequest,
  PantryItemCreated,
  LoadPantryItemLocations,
  NavigateToPantryItemPage,
  PantryItemDeleted,
  PantryItemLoaded,
  PantryItemLocationAdded,
  PantryItemLocationsLoadedSuccessfully,
  PantryItemLocationUpdated,
  PantryLoadedSuccessfully,
  PantryLoadFailed,
  SavePantryItemFailed,
  SavePantryItemSucceeded,
  PantryItemLocationDeleted,
  NoOp,
  DeletePantryItem, DeletePantryItemFailed, SavePantryItem
} from './pantry-management.actions';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {combineLatest} from 'rxjs'
import {catchError, concatMap, map, mapTo, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {PantryState} from './pantry-management.reducers';
import {Router} from '@angular/router';
import {IPantryDataService} from '../../../services/IPantryDataService';
import {PantryActions, PantryActionTypes} from './pantry-management.actions';
import {GroceryStoreLocationPossiblyAdded} from '../../../store';
import {PantryItem} from '../../../model/pantry-item';
import {AddOrRemoveItemFromShoppingLists, UpdateStoreShoppingList} from '../../shopping/store/shopping.actions';
import {selectCurrentGroceryStore} from '../../../store/store-management.selectors';
import {GroceryStoreState} from '../../../model/grocery-store';

@Injectable()
export class PantryEffects {
  constructor(private store: Store<PantryState>,
              private actions$: Actions <PantryActions>,
              @Inject('IPantryDataService') private pantryDataService: IPantryDataService,
              private router: Router) {
  }

  @Effect()
  public deletePantryItem = this.actions$.pipe(
    ofType(PantryActionTypes.DeletePantryItem),
    withLatestFrom(this.store.select(selectCurrentGroceryStore())),
    switchMap(([action, groceryStore]: [DeletePantryItem, GroceryStoreState]) => {
      return this.pantryDataService.deletePantryItem(action.deletePantryItemRequest).pipe(
          switchMap((_) =>  [
            new PantryItemDeleted(action.deletePantryItemRequest.id),
            groceryStore ? new UpdateStoreShoppingList(groceryStore.id) : new NoOp()
          ]),
          catchError(error => [new DeletePantryItemFailed(error)]));
    })
  );

  @Effect()
  public loadPantryItems$ = this.actions$.pipe(
    ofType(PantryActionTypes.LoadPantryItems),
    tap(() => console.log('calling getPantryItems() from effect')),
    switchMap(() => {
        return this.pantryDataService.getPantryItems().pipe(
          tap((data) => console.log(`getPantryItems returned ${JSON.stringify(data)}`)),
          map(data => new PantryLoadedSuccessfully(data)),
          catchError(error => {
            console.log('Error getting Pantry Items');
            return [new PantryLoadFailed(error)];
          })
        );
    })
  );

  @Effect()
  public getPantryItemDetails$ = this.actions$.pipe(
    ofType(PantryActionTypes.NavigatedToPantryItemPage),
    switchMap(payload => this.pantryDataService.getPantryItem(payload.pantryItemId)),
    switchMap((x) => {
      return [
        new PantryItemLoaded(x),
        new LoadPantryItemLocations(x.id),
      ];
    }),
    catchError(err => [new PantryLoadFailed(err)])
  );

  @Effect()
  public getPantryItemLocations$ = this.actions$.pipe(
    ofType(PantryActionTypes.LoadPantryItemLocations),
    switchMap(payload => this.pantryDataService.getPantryItemLocations(payload.itemId).pipe(
      map(locations => new PantryItemLocationsLoadedSuccessfully(payload.itemId, locations)),
      catchError(error => [new PantryLoadFailed(error)])
    ))
  );

  // @Effect()
  // public addNewPantryItem$ = this.actions$.pipe(
  //   ofType(PantryActionTypes.CreateItem),
  //   tap((payload) => console.log('Payload to addNewPantryItem$ ' + JSON.stringify(payload))),
  //   switchMap((payload) => {
  //     console.log('calling stateManagementService.addPantryItem()');
  //     return this.storeManagementService.addPantryItem(payload.pantryItemRequest).pipe(
  //       tap((something) => console.log(
  //         'return from addPantryItem, dispatching PantryItemCreated' + JSON.stringify(something))),
  //       map(newPantryitem => new ItemCreated(newPantryitem)),
  //       catchError(error => {
  //         console.log('CreatePantryItem failed');
  //         return [new CreateItemFailed(error)];
  //       })
  //     );
  //   }),
  // );

  @Effect()
  public createPantryItem$ = this.actions$.pipe(
    ofType(PantryActionTypes.CreatePantryItem),
    switchMap((payload) => {
      return this.pantryDataService.addPantryItem( {
        ...new PantryItem(),
        name: payload.pantryItemRequest.name
      }).pipe(
        tap((itemAdded) => {
          console.log(`item Added: ${itemAdded}`);
        }),
        map(itemAdded => new PantryItemCreated( itemAdded )),
        catchError(error => [new CreateItemFailed(payload.pantryItemRequest.name, error)])
      );
    }));

  @Effect({ dispatch: false })
  public navigateToPantryItemDetailsPage$ = this.actions$.pipe(
    ofType(PantryActionTypes.NavigateToPantryItemPage),
    tap((navigateToPantryItemPageRequest: NavigateToPantryItemPage) => {
      const navigationExtras = { queryParams:
          {
            id: navigateToPantryItemPageRequest.pantryItemRequest.id,
            newItem: navigateToPantryItemPageRequest.pantryItemRequest.newItem
          }
      };
      this.router.navigate([this.router.url, 'pantry-item-details'], navigationExtras);
    }));

  @Effect()
  public saveNewPantryItem$ = this.actions$.pipe(
    ofType(PantryActionTypes.SaveNewPantryItem),
    switchMap((payload) => {
      return this.pantryDataService.addPantryItem(payload.pantryItem).pipe(
        tap((itemAdded) => {
          console.log(`item Added: ${itemAdded}`);
        }),
        map(itemAdded => new PantryItemCreated( itemAdded )),
        catchError(error => [new CreateItemFailed(payload.pantryItem.name, error)])
      );
    }));

  @Effect()
  public editNewPantryItem$ = this.actions$.pipe(
    ofType(PantryActionTypes.PantryItemCreated),
    map((payload) => {
        return new NavigateToPantryItemPage({ id: payload.pantryItem.id, newItem: false });
      }));

  @Effect()
  public savePantryItem$ = this.actions$.pipe(
    ofType(PantryActionTypes.SavePantryItem),
    switchMap((payload) => {
      return this.pantryDataService.updatePantryItem(payload.pantryItem).pipe(
        map(itemUpdated => new SavePantryItemSucceeded( payload.pantryItem )),
        catchError(error => [new SavePantryItemFailed(error, payload.pantryItem)])
      );
    }));

  // @Effect()
  // public toggleNeedFlag$ = this.actions$.pipe(
  //   ofType(PantryActionTypes.ToggleNeed),
  //   switchMap((payload) => this.pantryDataService.updatePantryItem(payload.request)),
  //   switchMap(itemUpdated => [
  //             new SavePantryItemSucceeded(itemUpdated),
  //             new AddOrRemoveItemFromShoppingLists(itemUpdated)
  //       ]),
  //   catchError(error => [new SavePantryItemFailed(error, null)]));

  @Effect()
  public toggleNeedFlag$ = this.actions$.pipe(
    ofType(PantryActionTypes.ToggleNeed),
    switchMap((payload) =>
      combineLatest([this.pantryDataService.updatePantryItem(payload.request),
      this.pantryDataService.getPantryItemLocations(payload.request.id)])),
    switchMap(([itemUpdated, locations]) => [
      new SavePantryItemSucceeded(itemUpdated),
      new AddOrRemoveItemFromShoppingLists(itemUpdated, locations)
    ]),
    catchError(error => [new SavePantryItemFailed(error, null)]));

  @Effect({ dispatch: false })
  public navigateToNewLocationPage$ = this.actions$.pipe(
    ofType(PantryActionTypes.AddPantryItemLocationRequest),
    tap((navigateToLocationPage: AddPantryItemLocationRequest) => {
      // todo: make this single '/pantry-items/{pantry-item-id}/new-pantry-item-location
      const route = `/home/pantry-items/${navigateToLocationPage.request.pantryItem.id}/new-pantry-item-location`;
      this.router.navigateByUrl(route, { state: { returnUrl: navigateToLocationPage.returnUrl}});
    }));

  @Effect( {dispatch: false})
  public importedPantry$ = this.actions$.pipe(
    ofType(PantryActionTypes.PantryImportedSuccessfully),
    tap((payload: any) => {
      console.log('navigating to returnUrl: ', payload.returnUrl);
      this.router.navigateByUrl(payload.returnUrl);
    }));

  @Effect({ dispatch: false })
  public navigateToEditLocationPage$ = this.actions$.pipe(
    ofType(PantryActionTypes.EditPantryItemLocationRequest),
    tap((navigateToLocationPage: EditPantryItemLocationRequest) => {
      const navigationExtras = {
        queryParams:
          {
            storeId: navigateToLocationPage.request.storeLocation.storeId,
            storeName: navigateToLocationPage.request.storeLocation.storeName,
            aisle: navigateToLocationPage.request.storeLocation.aisle,
            section: navigateToLocationPage.request.storeLocation.section,
          },
        state: {
          returnUrl: navigateToLocationPage.returnUrl
        }
      };
      // tslint:disable-next-line:max-line-length
      const route = `/home/pantry-items/${navigateToLocationPage.request.pantryItemId}/pantry-item-location/${navigateToLocationPage.request.storeLocation.id}`;
      this.router.navigateByUrl(route, navigationExtras);
    }));

  @Effect()
  public deletePantryItemLocation = this.actions$.pipe(
    ofType(PantryActionTypes.DeletePantryItemLocation),
      switchMap((payload) => {
        console.log('calling deletePantryItemLocation');
        return this.pantryDataService.deletePantryItemLocation(payload.request.pantryItemId, payload.request.storeLocation.id).pipe(
          map((success) => new PantryItemLocationDeleted(payload.request.pantryItemId, payload.request.storeLocation))
        );
      }));


  @Effect()
  public addItemLocation = this.actions$.pipe(
    ofType(PantryActionTypes.AddPantryItemLocation),
    switchMap((payload) => {
      return this.pantryDataService.addNewPantryItemLocation(
        payload.addPantryItemLocation.itemId,
        payload.addPantryItemLocation.location).pipe(
          tap((pantryItemLocationAdded) => console.log(pantryItemLocationAdded)),
          concatMap((pantryItemLocationAdded) => [
            new PantryItemLocationAdded(payload.addPantryItemLocation.itemId, pantryItemLocationAdded),
            new GroceryStoreLocationPossiblyAdded(pantryItemLocationAdded),
        ]),
        catchError(error => {
          console.log(error);
          return [new AddPantryItemLocationFailed(error)];
        })
      );
    }));

  @Effect()
  public updateItemLocation = this.actions$.pipe(
    ofType(PantryActionTypes.UpdatePantryItemLocation),
    switchMap((payload) => {
      return this.pantryDataService.updatePantryItemLocation(
        payload.updatePantryItemLocation.itemId,
        payload.originalLocationId,
        payload.updatePantryItemLocation.location).pipe(
        map((newPantryItemLocation) => {
          return new PantryItemLocationUpdated(payload.updatePantryItemLocation.itemId, payload.originalLocationId, newPantryItemLocation, payload.returnUrl);
        }),
        catchError(error => {
          console.log(error);
          return [new AddPantryItemLocationFailed(error)];
        })
      );
    }));

  @Effect()
  public itemLocationAdded = this.actions$.pipe(
    ofType(PantryActionTypes.PantryItemLocationAdded),
    tap((navigateToItemPage: PantryItemLocationAdded) => {
      // todo: make this single '/pantry-items/{pantry-item-id}/new-pantry-item-location
      const route = `/home/pantry-items/pantry-item-details?id=${navigateToItemPage.itemId}&isNewItem=false`;
      this.router.navigateByUrl(route);
      // this.router.navigate(['/pantry-items/pantry-item-locations']);;
      // this.router.navigate(['../../manage']);
    }),
    switchMap((locationAdded: PantryItemLocationAdded) => {
      return this.pantryDataService.isPantryItemNeeded(locationAdded.itemId).pipe(
        map(isNeeded => isNeeded ?
          new UpdateStoreShoppingList(locationAdded.pantryItemLocation.storeId)
          : new NoOp()));
    }));

  @Effect()
  public itemLocationUpdated = this.actions$.pipe(
    ofType(PantryActionTypes.PantryItemLocationUpdated),
    // todo: route to previous page, not necessarilty to pantry item details
    // todo: update shopping list item if location of updated item is needed
    tap((locationUpdated: PantryItemLocationUpdated) => {
      this.router.navigateByUrl(locationUpdated.returnUrl);
    }),
    switchMap((locationUpdated: PantryItemLocationUpdated) => {
      return this.pantryDataService.isPantryItemNeeded(locationUpdated.itemId).pipe(
        map(isNeeded => isNeeded ?
          new UpdateStoreShoppingList(locationUpdated.pantryItemLocation.storeId)
            : new NoOp()));
    }));

  @Effect()
  public itemLocationDeleted = this.actions$.pipe(
    ofType(PantryActionTypes.PantryItemLocationDeleted),
    // todo: route to previous page, not necessarilty to pantry item details
    switchMap((locationDeleted: PantryItemLocationDeleted) => {
      return this.pantryDataService.isPantryItemNeeded(locationDeleted.itemId).pipe(
        map(isNeeded => isNeeded ?
          new UpdateStoreShoppingList(locationDeleted.location.storeId)
          : new NoOp()));
    }));
}
