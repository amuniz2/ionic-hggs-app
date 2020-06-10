import {IPantryDataService} from './IPantryDataService';
import {HggsData} from '../model/hggs-data';
import {combineAll, map, switchMap} from 'rxjs/operators';
import {GroceryStore} from '../model/grocery-store';
import {combineLatest, Observable, pipe, zip} from 'rxjs';
import {forEach} from '@angular-devkit/schematics';
import {GroceryStoreLocation} from '../model/grocery-store-location';

export interface IGroceryDataExporter {
  exportAll(): HggsData;
}

export class GroceryDataExporter implements IGroceryDataExporter {
  constructor(private pantryDataService: IPantryDataService) {}

  exportAll(): HggsData {
    // const result = new HggsData();
    // const pantryItems$ =  this.pantryDataService.getPantryItems();
    // const groceryStoreLocations$ =  this.pantryDataService.getGroceryStores().pipe(
    //   map(groceryStores => {
    //     const gsls$: Observable<GroceryStoreLocation[]>[] = [];
    //     result.groceryStores = groceryStores;
    //     groceryStores.forEach(goceryStore => gsls$.push(this.pantryDataService.getGroceryStoreLocations(goceryStore.id)));
    //     return pipe(combineAll(gsls$));
    //   }));
    //
    // combineLatest([pantryItems$, groceryStoreLocations$])
    //   .pipe().takeUntil().subscribe([pantryItems, groceryStoreLocations] =>
    // {
    //   result.pantryItems = pantryItems;
    // });
    //
    // const data = zip(
    //   this.pantryDataService.getGroceryStores(),
    //   this.pantryDataService.getPantryItems()
    // );
    //
    // return result;
    return new HggsData();
  }
}
