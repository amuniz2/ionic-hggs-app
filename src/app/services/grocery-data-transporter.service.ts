import {File, Entry, FileError, FileWriter, FileEntry, DirectoryEntry, Metadata, IFile} from '@ionic-native/file/ngx';
import {IPantryDataService} from './IPantryDataService';
import {HggsData} from '../model/hggs-data';
import {combineAll, map, mergeAll, mergeMap, switchMap, take, takeLast} from 'rxjs/operators';
import {forkJoin, from, Observable, of} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {GroceryStore} from '../model/grocery-store';
import {PantryItem} from '../model/pantry-item';

declare type DataReadCallback = (self: GroceryDataTransporter, data: HggsData) => Observable<boolean>;

interface IdMapping {
  originalId: number;
  importedId: number;
};

export interface IGroceryDataTransporter {
  exportAll(): Observable<string>;

  importFromFile(file: HggsFile);

  getFilesAvailableToDownload(): Observable<HggsFile[]>;

}

export interface HggsFile extends Entry {
  dateModified?: Date;
}

@Injectable()
export class GroceryDataTransporter implements IGroceryDataTransporter {
  private dataExported: HggsData;
  private downloadedHggsFiles: Entry[];
  private hggsFiles: HggsFile[];
  private parentDirectory: DirectoryEntry;

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
      // this.fileManager.tempDirectory
      console.log(`temp directory: ${this.fileManager.tempDirectory}; app storage directory: ${this.fileManager.applicationStorageDirectory}`)
      const fileEntry = await this.fileManager.createFile(this.fileManager.applicationStorageDirectory, 'grocery-data.hggs', true);
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
  }

  private getDirectoryName(storageDir: string): string {
    if (!storageDir) {
      console.log('storage dir was falsy');
      return null;
    }
    console.log(`storageDir: ${storageDir}`);
    if (storageDir.endsWith('/')) {
      const dirName = storageDir.substring(0, storageDir.lastIndexOf('/'));
      console.log(`dirName after removing liast /: ${dirName} returning ${dirName.substring(dirName.lastIndexOf('/')+1)}`);
      return dirName.substring(dirName.lastIndexOf('/')+1);
    } else {
      return storageDir.substring(storageDir.lastIndexOf('/')+1);
    }
  }

  private async getDirectoryListing(storageDir: string, directoryName: string = '') : Promise<Entry[]> {
    // const directoryName = this.getDirectoryName(storageDir);
    if (directoryName === null) {
      return [];
    }

    const listing = await this.fileManager.listDir(storageDir, directoryName);
    listing.forEach( entry => {
      if (entry.isDirectory) {
        this.getDirectoryListing(storageDir, entry.name);
      }
    })
    this.logListing(storageDir, directoryName, listing);
    return listing;
  }

  private logListing(storageDir: string, dirName: string, entries: Entry[]) {
    console.log(`Listing for ${storageDir} with dirName ${dirName}:`);
    entries.forEach(entry => {
      console.log(entry);
    })
  }

  public getFilesAvailableToDownload() : Observable<HggsFile[]> {
    this.hggsFiles = [];

    return from(this.fileManager.listDir(this.fileManager.externalRootDirectory,'Download').then((entries) => {
      this.downloadedHggsFiles = entries.filter(file => file.isFile && file.name.endsWith('.hggs'));
      console.log(`downloaded hggs files: ${JSON.stringify(this.downloadedHggsFiles)}`);
      this.downloadedHggsFiles.forEach((entry) => {
        const hggsFile: HggsFile = { ...entry  };
        this.hggsFiles.push(hggsFile);
        console.log(`calling getMetadata for ${entry.name}`);
        entry.getMetadata((metadata) => {
          console.log(`adding ${entry.name} to hggs files`);
          hggsFile.dateModified = metadata.modificationTime;
        }, (error: FileError) => {
          console.log('Error occurred getting metadata');
          console.error(error);
          return null;
        });
      });
      return this.hggsFiles;
    }));

    // const fileEntry = await this.fileManager.getFile(parentDirectory, 'grocery-data-2.hggs', { create: false } );
    // let result: HggsFile;
    // fileEntry.getMetadata((metadata => {
    //   result = {
    //     ...fileEntry,
    //     dateModified: metadata.modificationTime
    //   };
    // }));
    // return result;
  }
  private handleFileError(err: FileError) {
    console.error(err);
  }

  private async readFile(importFile: HggsFile, action: DataReadCallback)
  {
      try {
        const parentDirectory = await this.fileManager.resolveLocalFilesystemUrl(this.fileManager.externalRootDirectory);
        parentDirectory.filesystem.root.getFile(importFile.fullPath, { create: false }, (fileEntry:FileEntry) => {
          fileEntry.file((file: IFile) => {
            const reader: FileReader = new FileReader();

            reader.onloadend = (e) => {
              returnHggsData(JSON.parse(reader.result as string));
            };

            reader.readAsText(file);
          }, this.handleFileError);
        }, this.handleFileError);
      }
      catch(err) {
        console.error(err);
      }

      const returnHggsData = (data: HggsData) => {
        action(this, data);
      };
  }

  private importGroceryStoreAisles(groceryStoreId: number, aislesToImport: string[]) {
    this.pantryDataService.getGroceryStoreAisles(groceryStoreId).pipe(
      map(existingAisles  => {
        const newAisles = aislesToImport.filter(aisleToImport => !existingAisles.has(aisleToImport));
        newAisles.forEach(newAisle => this.pantryDataService.addGroceryStoreAisle({groceryStoreId, name: newAisle}));
      })
    );
  }

  private importGroceryStoreSections(groceryStoreId: number, sectionsToImport: string[]) {
    this.pantryDataService.getGroceryStoreSections(groceryStoreId).pipe(
      map(existingSections  => {
        const newSections = sectionsToImport.filter(sectionToImport => !existingSections.has(sectionToImport));
        newSections.forEach(newSection => this.pantryDataService.addGroceryStoreSection({groceryStoreId, name: newSection}));
      })
    );
  }

  private importGroceryStore = (groceryStoreToImport: GroceryStore, aislesToImport, sectionsToImport): Observable<number> => {
    return this.pantryDataService.getGroceryStoreByName(groceryStoreToImport.name).pipe(
      map(existingGroceryStore  => {
        if (existingGroceryStore === null) {
          this.pantryDataService.addGroceryStore({ ...groceryStoreToImport }).subscribe((newGroceryStore) => { return newGroceryStore.id});
        } else {
          return existingGroceryStore.id;
        }
      }),
      map((groceryStoreId: number) => {
        this.importGroceryStoreAisles(groceryStoreId, aislesToImport);
        this.importGroceryStoreSections(groceryStoreId, sectionsToImport);
        return groceryStoreId;
      })
    );
  };

  private importPantryItem = (pantryItemToImport: PantryItem): Observable<number> => {
    return this.pantryDataService.getPantryItemByName(pantryItemToImport.name).pipe(
      map(existingPantryItem  => {
        if (existingPantryItem === null) {
          this.pantryDataService.addPantryItem({ ...pantryItemToImport }).subscribe((newPantryItem) => { return newPantryItem.id});
        } else {
          return existingPantryItem.id;
        }
      })
    );
  };
  // private importGroceryStore(groceryStoreToImport: GroceryStore, aislesToImport, sectionsToImport) : Observable<boolean> {
  //   return this.pantryDataService.getGroceryStoreByName(groceryStoreToImport.name).pipe(
  //     map(existingGroceryStore  => {
  //       if (existingGroceryStore === null) {
  //         this.pantryDataService.addGroceryStore({ ...groceryStoreToImport }).subscribe((newGroceryStore) => { return newGroceryStore.id});
  //       } else {
  //         return existingGroceryStore.id;
  //       }
  //     }),
  //     map((groceryStoreId: number) => {
  //       this.importGroceryStoreAisles(groceryStoreId, aislesToImport);
  //       this.importGroceryStoreSections(groceryStoreId, sectionsToImport);
  //       return true;
  //     })
  //   );
  // }

  private importGroceryStores(self: GroceryDataTransporter, data: HggsData): Observable<IdMapping[]> {
    const importedGroceryStoreIdMappings: {originalId: number, importedId: number}[] = [];
    data.groceryStores.forEach(groceryStore => {
      const groceryStoreImported$ = self.importGroceryStore(groceryStore,
        data.groceryStoreAisles.filter(storeAisle => storeAisle.storeId === groceryStore.id).map(storeAisle => storeAisle.aisle),
        data.groceryStoreSections.filter(storeSection => storeSection.storeId === groceryStore.id).map(storeSection => storeSection.section));
      groceryStoreImported$.subscribe((resultId: number) => {
        if (resultId > 0) {
          console.log(`imported ${groceryStore.name}`);
          importedGroceryStoreIdMappings.push({ originalId: groceryStore.id, importedId: resultId});
        } else {
          console.error(`failed to import ${groceryStore.name}`);
        }
      });
    });
    return of(importedGroceryStoreIdMappings);
  }

  private finishedImportingPantryItemsAndGroceryStores(data: HggsData, mappedGroceryStoreIds: IdMapping[], mappedPantryItemIds: IdMapping[]): boolean {
    return (data.groceryStores.length === mappedGroceryStoreIds.length) && (data.pantryItems.length === mappedPantryItemIds.length);
  }

  private importData(self: GroceryDataTransporter, data: HggsData): Observable<boolean> {
    console.log(`data successfully read and parsed: ${JSON.stringify(data)}`);
    const importedGroceryStoreIdMappings: {originalId: number, importedId: number}[] = [];
    const importedPantryItemIdMappings: {originalId: number, importedId: number}[]= [];

    data.groceryStores.forEach(groceryStore => {
      const groceryStoreImported$ = self.importGroceryStore(groceryStore,
        data.groceryStoreAisles.filter(storeAisle => storeAisle.storeId === groceryStore.id).map(storeAisle => storeAisle.aisle),
        data.groceryStoreSections.filter(storeSection => storeSection.storeId === groceryStore.id).map(storeSection => storeSection.section));
      groceryStoreImported$.subscribe((resultId: number) => {
        if (resultId > 0) {
          console.log(`imported ${groceryStore.name}`);
          importedGroceryStoreIdMappings.push({ originalId: groceryStore.id, importedId: resultId});
          self.importPantryItemLocationsForGroceryStore(groceryStore.id, resultId, importedPantryItemIdMappings);
        } else {
          console.error(`failed to import ${groceryStore.name}`);
        }
      });
    });

    data.pantryItems.forEach(pantryItem => {
      const pantryItemImported$ = self.importPantryItem(pantryItem);
      pantryItemImported$.subscribe((resultId: number) => {
        if (resultId > 0) {
          console.log(`imported ${pantryItem.name}`);
          importedPantryItemIdMappings.push({originalId: pantryItem.id, importedId: resultId});
          self.importPantryItemLocationsForPantryItem(pantryItem.id, resultId, importedGroceryStoreIdMappings);
        } else {
          console.error(`failed to import ${pantryItem.name}`);
        }
      });
    });

    forkJoin(importedGroceryStores, importedPantryItems)
  }

  public async importFromFile(importFile: HggsFile) {
    await this.readFile(importFile, this.importData);
  }

  public async importDataOLd(importFile: HggsFile) {
    // const result: Entry[] = [];
    // [
    // //   {
    // //   dir: this.fileManager.dataDirectory,
    // //   name: 'dataDirectory'
    // // },{
    // //     dir: this.fileManager.applicationStorageDirectory,
    // //     name: 'applicationStorageDirectory'
    // //   },
    // //   {
    // //     dir: this.fileManager.tempDirectory,
    // //     name: 'tempDirectory'
    // //   },{
    // //   dir: this.fileManager.applicationDirectory,
    // //   name: 'applicationDirectory'
    // // },{
    // //   dir: this.fileManager.cacheDirectory,
    // //   name: 'cacheDirectory'
    // // },{
    // //   dir: this.fileManager.documentsDirectory,
    // //   name: 'documentsDirectory'
    // // },
    // //   {
    // //   dir: this.fileManager.externalApplicationStorageDirectory,
    // //   name: 'externalApplicationStorageDirectory'
    // // },
    // //   {
    // //   dir: this.fileManager.externalCacheDirectory,
    // //   name: 'externalCacheDirectory'
    // // },
    //   {
    //   dir: this.fileManager.externalDataDirectory,
    //   name: 'externalDataDirectory'
    // },
    //   {
    //   dir: this.fileManager.externalRootDirectory,
    //   name: 'externalRootDirectory'
    // }
    // ].forEach(async (dirDesc) => {
    //   console.log(dirDesc.name);
    //   const listing = await this.getDirectoryListing(dirDesc.dir);
    //   result.concat(listing);
    // });
    // const entries = await this.getDirectoryListing(this.fileManager.externalRootDirectory, 'Download');
    return true;
  }
}
