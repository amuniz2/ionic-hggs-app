import {createFeatureSelector, createSelector, select} from '@ngrx/store';
import {GroceryStore} from '../model/grocery-store';
import {AppState, GroceryItemLocationsState, GroceryStoresState} from './app.state';
import * as fromAdapter from './grocery-store.adapter';
import {GroceryStoreLocation} from '../model/grocery-store-location';
import {of} from 'rxjs';
// import * as fromAdapter from '../../store-management/store/grocery-store.adapter';

// export const getStoreManagementState = createFeatureSelector<SharedStoresState>('storeManagement');
const getAppState = createFeatureSelector<AppState>('app');
export const getGroceryStoresState = createSelector(
  getAppState,
  (state: AppState) => state.groceryStores
);

export const selectGroceryStoreEntities = createSelector(
  getGroceryStoresState,
  fromAdapter.selectGroceryStoreEntities
);

export const selectGroceryStoreIds = createSelector(
  getGroceryStoresState,
  fromAdapter.selectGroceryStoreIds
);

export const selectGroceryStoreCount = createSelector(
  getGroceryStoresState,
  fromAdapter.groceryStoreCount
);

export const selectAllGroceryStores = createSelector(
  getGroceryStoresState,
  fromAdapter.selectAllGroceryStores
);

export const selectGroceryStore = (id: number) => createSelector(
  selectAllGroceryStores, (state: GroceryStore[]) => state.find((store) => store.id === id));

export const selectGroceryStoreAisles = (id: number) => createSelector(
  selectGroceryStore(id), (state: GroceryStore) => state.aisles);

export const selectGroceryStoreSections = (id: number) => createSelector(
  selectGroceryStore(id), (state: GroceryStore) => state.sections);

export const selectGroceryStoresLoading = createSelector(
  getGroceryStoresState,
  (state: GroceryStoresState) => state.loading
);

export const getGroceryStore = (state: GroceryStoresState, id: number) => state.entities[id];

export const getGroceryItemsLocationsState = createSelector(
  getAppState,
  (state: AppState) => state.groceryItemLocations
);

export const selectAllGroceryStoreLocations = createSelector(
  getGroceryItemsLocationsState,
  fromAdapter.selectAllGroceryStoreLocations
);


export const selectGroceryStoreLocation = (id: number) => createSelector(
  selectAllGroceryStoreLocations, (state: GroceryStoreLocation[]) => state.find((storeLocation) => storeLocation.id === id));

export const selectGroceryStoreSectionsInAisle = (id: number, aisle: string) => createSelector(
  selectGroceryStore(id), (groceryStore: GroceryStore) => groceryStore
    .locations.filter((location) => location.aisle === aisle)
    .map(location => location.section));

/*
export const selectGroceryStore = (id: number) => createSelector(
  selectAllGroceryStores, (state: GroceryStore[]) => state.find((store) => store.id === id));

 */
// export const selectGroceryStoreLocations = (storeId: number) => createSelector(
//   selectAllGroceryStoreLocations, (state: GroceryItemLocationsState) => groceryStore
//     .locations.filter((location) => location.aisle === aisle)
//     .map(location => location.section));

export const selectGroceryStoreSectionsInNoAisle = (id: number) => createSelector(
  selectGroceryStore(id), (groceryStore: GroceryStore) => groceryStore
    .locations.filter((location) => location.section && !location.aisle)
    .map(location => location.section));

export const selectPossibleGroceryStoreSectionsInAisle = (storeId: number, aisle) => createSelector(
  selectGroceryStore(storeId), (groceryStore: GroceryStore) => {
      const sectionsInAisle = groceryStore.locations.filter((location) => location.aisle === aisle).map(location => location.section);
      return sectionsInAisle.concat(groceryStore.sections.filter((section) =>
        !groceryStore.locations.some(loc => loc.section === section) ||
        groceryStore.locations.some(loc => !loc.aisle && loc.section === section)));
    });

export const  selectPossibleGroceryStoreAislesForSection = (id: number, section: string) => createSelector(
  selectGroceryStore(id), (groceryStore: GroceryStore) => {
    const locationWithSectionAndAisle = groceryStore.locations.find((location) => location.aisle && location.section === section);
    if (locationWithSectionAndAisle) {
      return [locationWithSectionAndAisle.aisle];
    }
    return groceryStore.aisles;
  });

export const getGroceryStoreLocation = (state: GroceryItemLocationsState, locationId: number) => state.entities[locationId];
