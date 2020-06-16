import {File, FileError, FileWriter} from '@ionic-native/file/ngx';
import {IPantryDataService} from './IPantryDataService';
import {HggsData} from '../model/hggs-data';
import {catchError, combineAll, map, switchMap, take} from 'rxjs/operators';
import {GroceryStore} from '../model/grocery-store';
import {combineLatest, forkJoin, from, observable, Observable, of, pipe, throwError, zip} from 'rxjs';
import {forEach} from '@angular-devkit/schematics';
import {GroceryStoreLocation} from '../model/grocery-store-location';
import {Inject, Injectable} from '@angular/core';

export interface IGroceryDataExporter {
  exportAll(): Observable<string>;
}

@Injectable()
export class GroceryDataExporter implements IGroceryDataExporter {
  private dataExported: HggsData;
  constructor(@Inject('IPantryDataService') private pantryDataService: IPantryDataService, private fileManager: File) {
    this.dataExported = new HggsData();
  }

  private fileWriterCreated(fileWriter: FileWriter) {
    console.log('writing file');
    fileWriter.write(JSON.stringify(this.dataExported));
  }

  private failedToCreateFileWriter(err: FileError) {
    console.log(`in failedToCreateFileWriter: ${JSON.stringify(err)}`);
  }

  private async writeDataToFile(): Promise<string> {
    try {
      this.fileManager.readAsText()
      // this.fileManager.tempDirectory
      console.log(`temp directory: ${this.fileManager.tempDirectory}; app storage directory: ${this.fileManager.applicationStorageDirectory}`)
      const fileEntry = await this.fileManager.createFile(this.fileManager.applicationStorageDirectory, 'hggsData.json', true);
      console.log(`fileEntry: ${JSON.stringify(fileEntry)}`);
      fileEntry.createWriter((fileWriter => {
        console.log('writing file');
        fileWriter.write(JSON.stringify(this.dataExported));
      }), this.failedToCreateFileWriter);
      return fileEntry.nativeURL;
    }
    catch(err) {
      console.log(`error writing to file: ${JSON.stringify(err)}`);
    }
  }

  public exportAll(): Observable<string> {

    console.log('Inside export all');
    const tasks$ = [];
    tasks$.push(this.pantryDataService.getGroceryStores());
    tasks$.push(this.pantryDataService.getPantryItems());
    tasks$.push(this.pantryDataService.getAllGroceryStoreAisles());
    tasks$.push(this.pantryDataService.getAllGroceryStoreSections());
    tasks$.push(this.pantryDataService.getAllGroceryStoreLocations());
    tasks$.push(this.pantryDataService.getAllPantryItemLocations());

    const exportedFile$ = forkJoin(...tasks$).pipe(
      take(1),
      switchMap(([groceryStores, pantryItems, storeAisles, storeSections, storeLocations, itemLocations])=> {
        this.dataExported = {
          groceryStores,
          pantryItems,
          groceryStoreLocations: storeLocations,
          groceryStoreSections: storeSections,
          groceryStoreAisles: storeAisles,
          pantryItemLocations: itemLocations
        };
        return from(this.writeDataToFile());
        // return this.writeDataToFile().then((fileName) => fileName);
      }));

    return exportedFile$;
    // exportedData$.subscribe((exportedData => {
    //   this.dataExported.groceryStores = exportedData.groceryStores;
    //   this.dataExported.pantryItems = exportedData.pantryItems;
    //   this.dataExported.groceryStoreLocations = exportedData.storeLocations;
    // }));

    // return from(this.writeDataToFile());

    // return exportedData$.pipe(
    //   switchMap(exportedData => {
    //     const data = new HggsData();
    //     data.groceryStores = exportedData.groceryStores;
    //     data.pantryItems = exportedData.pantryItems;
    //     data.groceryStoreLocations = exportedData.storeLocations;
    //     return from(this.writeDataToFile(data));
    //   })
    // );
    // // return forkJoin(...tasks$).pipe(
    //   switchMap(results => {
    //     console.log(`results from export: ${results}`);
    //     const data = new HggsData();
    //     data.groceryStores = results[0];
    //     data.pantryItems = results[1];
    //     data.groceryStoreLocations = results[4];
    //     return from(this.writeDataToFile(data));
    // }),
    //   catchError(err => {
    //     console.log(`Error during export: ${err}`);
    //     return throwError(err);
    //   }));

    // const result = new HggsData();
    // const pantryItems$ =  this.pantryDataService.getPantryItems();
    // this.pantryDataService.getGroceryStores().pipe(
    //   map(groceryStores => {
    //     result.groceryStores = groceryStores;
    //   }));
    // this.pantryDataService.getPantryItems().pipe(
    // );
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
    // return from(this.writeDataToFile(result));
    // return new HggsData();
  }
}
