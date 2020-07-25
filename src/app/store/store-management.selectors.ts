import {createFeatureSelector, createSelector, select} from '@ngrx/store';
import {GroceryStore, GroceryStoreState} from '../model/grocery-store';
import {AppState, GroceryItemLocationsState, GroceryStoresState} from './app.state';
import * as fromAdapter from './grocery-store.adapter';
import {GroceryStoreLocation} from '../model/grocery-store-location';
import {selectPantryItemLocations} from '../modules/pantry-management/store/pantry-management.selectors';
import {PantryItemLocation} from '../model/PantryItemLocation';
import {App} from 'ionic';

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
  selectAllGroceryStores, (state: GroceryStoreState[]) => state.find((store) => store.id === id));

export const selectCurrentGroceryStore = () => createSelector(
  getAppState, (state: AppState) => state.groceryStores.selectedGroceryStore);

export const selectGroceryStoreAisles = (id: number) => createSelector(
  selectGroceryStore(id), (state: GroceryStoreState) => state.aisles);

export const selectGroceryStoreSections = (id: number) => createSelector(
  selectGroceryStore(id), (state: GroceryStoreState) => state.sections);

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
  selectGroceryStore(id), (groceryStore: GroceryStoreState) => groceryStore
    .locations.filter((location) => location.aisle === aisle)
    .map(location => location.section));

export const selectAislesInUse = (groceryStoreId: number) => selectStoreLocationComponentsInuse(groceryStoreId, 'aisle');

export const selectSectionsInUse = (groceryStoreId: number) => selectStoreLocationComponentsInuse(groceryStoreId, 'section');

const selectStoreLocationComponentsInuse = (groceryStoreId: number, component: string) => createSelector(
  selectAllGroceryStoreLocations,
  (state: GroceryStoreLocation[]) => {
    const componentsInUse: Set<string> = new Set<string>();
    state.filter(loc => loc.storeId === groceryStoreId && loc[component]).forEach(
      (loc) => {
        if (!componentsInUse.has(loc[component])) {
          componentsInUse.add(loc[component]);
        }
      });
    return Array.from(componentsInUse);
  });

export const selectGroceryStoreSectionsInNoAisle = (id: number) => createSelector(
  selectGroceryStore(id), (groceryStore: GroceryStoreState) => groceryStore
    .locations.filter((location) => location.section && !location.aisle)
    .map(location => location.section));

export const selectPossibleGroceryStoreSectionsInAisle = (storeId: number, aisle) => createSelector(
  selectGroceryStore(storeId), (groceryStore: GroceryStoreState) => {
      const sectionsInAisle = groceryStore.locations?.filter((location) => location.aisle === aisle).map(location => location.section);
      return sectionsInAisle.concat(groceryStore.sections?.filter((section) =>
        !groceryStore.locations.some(loc => loc.section === section) ||
        groceryStore.locations.some(loc => !loc.aisle && loc.section === section)));
    });

export const  selectPossibleGroceryStoreAislesForSection = (storeId: number, section: string) => createSelector(
  selectGroceryStore(storeId), (groceryStore: GroceryStoreState) => {
    const locationWithSectionAndAisle = groceryStore.locations.find((location) => location.aisle && location.section === section);
    if (locationWithSectionAndAisle) {
      console.log(`returning [locationWithSectionAndAisle.aisle] ${[locationWithSectionAndAisle.aisle]}`);
      return ([locationWithSectionAndAisle.aisle]);
    }
    console.log(`returning groceryStore.aisles ${groceryStore.aisles}`);
    return groceryStore.aisles;
  });

export const getGroceryStoreLocation = (state: GroceryItemLocationsState, locationId: number) => state.entities[locationId];
