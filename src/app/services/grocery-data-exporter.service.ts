import {File, Entry, FileError, FileWriter, FileEntry, DirectoryEntry, Metadata, IFile} from '@ionic-native/file/ngx';
import {IdMapping, IPantryDataService} from './IPantryDataService';
import {HggsData} from '../model/hggs-data';
import {map, switchMap, take} from 'rxjs/operators';
import {forkJoin, from, Observable, of, zip} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {ShoppingList} from '../model/shopping-list';
import {ShoppingItem} from '../model/shopping-item';

declare type DataReadCallback = (self: GroceryDataExporter, data: HggsData) => Observable<boolean>;

export enum ShoppingListFormat {
  Text,
  Html
};

export interface GroceryStoreLocationsImport {
  groceryStoreId: number,
  locationMappings$: Observable<IdMapping[]>;
};

export interface IGroceryDataExporter {
  dataHandler: (data: HggsData, state: any) => void;

  exportAll(): Observable<string>;

  exportShoppingList(list: ShoppingList, format: ShoppingListFormat): Observable<{contents: string, fileName: string}>;

  importFromFile(file: HggsFile, state: any): Observable<boolean>;

  getFilesAvailableToDownload(): Observable<HggsFile[]>;

  importData(self: IGroceryDataExporter, data: HggsData): Observable<boolean>;

  listFolders(); // debugging
}

export interface HggsFile extends Entry {
  dateModified?: Date;
  parentFolder: string;
}

@Injectable()
export class GroceryDataExporter implements IGroceryDataExporter {
  private dataExported: HggsData;
  private downloadedHggsFiles: Entry[];
  private hggsFiles: HggsFile[];
  private parentDirectory: DirectoryEntry;
  public state: any;

  public dataHandler: (data: HggsData, state: any) => void;

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

  private async writeDataToFile(data: string, fileName: string): Promise<string> {
    let fileNameUrl = '';
    try {
      // this.fileManager.tempDirectory
      console.log(`data directory: ${this.fileManager.dataDirectory}; app storage directory: ${this.fileManager.applicationStorageDirectory}`)
      const fileEntry = await this.fileManager.createFile(this.fileManager.dataDirectory, fileName, true);
      fileEntry.createWriter((fileWriter => {
        console.log('writing file');
        // fileWriter.write(JSON.stringify(this.dataExported));
        fileWriter.write(JSON.stringify(data));
      }), this.failedToCreateFileWriter);
      fileNameUrl = fileEntry.nativeURL;
      return fileNameUrl;
    }
    catch(err) {
      console.log(`error: ${JSON.stringify(err)} writing to file: ${JSON.stringify(fileName)}`);
    }
  }

  public exportShoppingList(list: ShoppingList, format: ShoppingListFormat): Observable<
    {contents: string, fileName: string}> {
    let fileContents: string;
    if (format === ShoppingListFormat.Text) {
      fileContents =  this.exportTextShoppingList(list);
      // from(this.writeDataToFile(fileContents, 'shoppingList.html'));
    } else {
      fileContents = this.exportHtmlShoppingList(list);
    }
    from(this.writeDataToFile(fileContents, 'shoppingList.html'));
    return of({ contents: fileContents, fileName: 'shoppingList.html'});
  }

  public exportTextShoppingList(list: ShoppingList): string {
    const aislesSection =  this.buildAislesSection(list);
    const sectionsSection = this.buildSectionsSection(list);
    const result = `${aislesSection}${sectionsSection}`;
    if (list.itemsWithNoStoreLocation?.length > 0) {
      return result.concat(this.buildSectionWithNoLocations(list));
    } else {
      return result;
    }
  }

  private createDOMDocument(): HTMLDocument {
    const htmlAsString = '<html></html>';
    const parser = new DOMParser();
    return parser.parseFromString(htmlAsString, 'text/html');
  }

  public exportHtmlShoppingList(list: ShoppingList): string {
    try {
      const doc: HTMLDocument = this.createDOMDocument();
      const body = doc.getElementsByTagName('body').item(0);
      const shoppingListHeader = doc.createElement('h1');
      shoppingListHeader.innerText = 'Shopping List';
      body.appendChild(shoppingListHeader);
      this.buildAislesHtmlSection(list, body);
      this.buildSectionsHtml(list, body);
      if (list.itemsWithNoStoreLocation?.length > 0) {
        this.buildOtherSectionHtml(list, body);
      }
      return doc.documentElement.outerHTML;
    } catch(e) {
      console.log('exception occurred');
      console.log(e);
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
        return from(this.writeDataToFile(JSON.stringify(this.dataExported), 'grocery-data.hggs'));
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
      if (entry.isFile) {
        console.log(entry);
      }
    })
  }

  public getFilesAvailableToDownload() : Observable<HggsFile[]> {
    this.hggsFiles = [];
    let parentFolder: string;
    let subFolder: string;
    if (this.fileManager.externalRootDirectory === null) {
      parentFolder = this.fileManager.documentsDirectory;
      subFolder = 'NoCloud';
      subFolder = '';
    } else {
      parentFolder = this.fileManager.externalRootDirectory;
      subFolder = 'Download';
    }
    console.log(`parentFolder: ${parentFolder}, subFolder: ${subFolder}`);
    return from(this.fileManager.listDir(parentFolder,subFolder).then((entries) => {
      console.log('files found in folder: ', JSON.stringify(entries));
      this.downloadedHggsFiles = entries.filter(file => file.isFile && file.name.endsWith('.hggs'));
      console.log(`downloaded hggs files: ${JSON.stringify(this.downloadedHggsFiles)}`);
      this.downloadedHggsFiles.forEach((entry) => {
        const hggsFile: HggsFile = { ...entry, parentFolder };
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
    }).catch(err =>{
      console.log('Error occurred getting list of files');
      console.error(err);
      return this.hggsFiles;
    }));
  }

  private handleFileError(err: FileError) {
    console.error(err);
  }

  private async readFile(importFile: HggsFile, action: DataReadCallback)
  {
      try {
        const parentDirectory = await this.fileManager.resolveLocalFilesystemUrl(importFile.parentFolder);
        parentDirectory.filesystem.root.getFile(importFile.fullPath, { create: false }, (fileEntry:FileEntry) => {
          fileEntry.file((file: IFile) => {
            const reader: FileReader = new FileReader();

            reader.onloadend = (e) => {
              if (this.dataHandler) {
                this.dataHandler(JSON.parse(reader.result as string), this.state);
              } else {
                returnHggsData(JSON.parse(reader.result as string));
              }
            };

            reader.readAsText(file);
          }, this.handleFileError);
        }, this.handleFileError);
      }
      catch(err) {
        console.error(err);
      }

      const returnHggsData = (data: HggsData) => {
        action(this, data).subscribe((succeeded) => {
          console.log(`import returned: ${succeeded}`);
          // todo: throw exception if not?
        });
      };
  }

  public importData(self: GroceryDataExporter, data: HggsData): Observable<boolean> {
    return of(true);
  }

  public importFromFile(importFile: HggsFile, state: any): Observable<boolean> {
    this.state = state;
    return this.importFromFileAsPromise(importFile);
  }

  private importFromFileAsPromise(importFile: HggsFile): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.readFile(importFile, this.importData).then(() => {
        observer.next();
        observer.complete();
        return of(true);
      }).catch((err) => observer.error(err));
    });
  }

  public async listFolders(): Promise<any> {
    const result: Entry[][] = [];
    await
    [
    //   {
    //   dir: this.fileManager.dataDirectory,
    //   name: 'dataDirectory'
    // },{
    //     dir: this.fileManager.applicationStorageDirectory,
    //     name: 'applicationStorageDirectory'
    //   },
    //   {
    //     dir: this.fileManager.tempDirectory,
    //     name: 'tempDirectory'
    //   },{
    //   dir: this.fileManager.applicationDirectory,
    //   name: 'applicationDirectory'
    // },{
    //   dir: this.fileManager.cacheDirectory,
    //   name: 'cacheDirectory'
    // },
      {
      dir: this.fileManager.documentsDirectory,
      name: 'documentsDirectory'
    },
    //   {
    //   dir: this.fileManager.externalApplicationStorageDirectory,
    //   name: 'externalApplicationStorageDirectory'
    // },
    //   {
    //   dir: this.fileManager.externalCacheDirectory,
    //   name: 'externalCacheDirectory'
    // },
    //   {
    //   dir: this.fileManager.externalDataDirectory,
    //   name: 'externalDataDirectory'
    // },
    //   {
    //   dir: this.fileManager.externalRootDirectory,
    //   name: 'externalRootDirectory'
    // }
    ].forEach( async (dirDesc) => {
      console.log(`directory name: ${dirDesc.name}; directory:${dirDesc.dir}`);
      if (dirDesc.dir !== null) {
        console.log('getting directory listing for: ', dirDesc.name);
        await this.getDirectoryListing(dirDesc.dir);
      }
      // const listing = await this.getDirectoryListing(dirDesc.dir);
    });
//    const entries = await this.getDirectoryListing(this.fileManager.externalRootDirectory, 'Download');
    return result;
  }

  private buildAislesSection(list: ShoppingList): string {
    let result = '';
    list.aisles.forEach(aisle => {
      result = result.concat(`Aisle ${aisle.name}\n`);
      aisle.sections.forEach(section => {
        section.shoppingItems.forEach(item => {
          result = result.concat(`\t${item.name}\n`);
        });
      });
      aisle.shoppingItems.forEach(item => {
        result = result.concat(`\t${item.name}\n`);
      });
    });
    return result;
  }

  private buildAislesHtmlSection(list: ShoppingList, parent: HTMLElement) {
    const doc = parent.ownerDocument;
    list.aisles.forEach(aisle => {
      const curAisleHeader = doc.createElement('h1');
      const aisleList = doc.createElement('ul');
      parent.appendChild(curAisleHeader);
      curAisleHeader.innerText = `Aisle ${aisle.name}`;
      parent.appendChild(aisleList);
      aisle.sections.forEach(section => {
        section.shoppingItems.forEach(item => {
          this.addShoppingListItemHtml(aisleList, item);
        });
      });
      aisle.shoppingItems.forEach(item => {
        this.addShoppingListItemHtml(aisleList, item);
      });
    });
  }

  private buildSectionsHtml(list: ShoppingList, parent: HTMLElement) {
    const doc = parent.ownerDocument;
    list.sections.forEach(section => {
      const sectionHeader = doc.createElement('h2');
      sectionHeader.innerText = `${section.name} Section\n`;
      parent.appendChild(sectionHeader);
      const sectionList = doc.createElement('ul');
      parent.appendChild(sectionList);
      section.shoppingItems.forEach(item => {
        this.addShoppingListItemHtml(sectionList, item);
      });
    });
  }

  private buildOtherSectionHtml(list: ShoppingList, parent: HTMLElement) {
    const doc = parent.ownerDocument;
    const otherHeader = doc.createElement('h2');
    otherHeader.innerText = 'Other';
    parent.appendChild(otherHeader);
    const otherList = doc.createElement('ul');
    parent.appendChild(otherList);
    list.itemsWithNoStoreLocation.forEach(item => {
      this.addShoppingListItemHtml(otherList, item);
    });
  }

  private addShoppingListItemHtml(parent: HTMLElement, shoppingItem: ShoppingItem) {
    const li = parent.ownerDocument.createElement('li');
    li.innerText = shoppingItem.name;
    parent.appendChild(li);
  }

  private buildSectionsSection(list: ShoppingList): string {
    let result = '';
    list.sections.forEach(section => {
      result = result.concat(`Section ${section.name}\n`);
      section.shoppingItems.forEach(item => {
        result = result.concat(`\t${item.name}\n`);
      });
    });
    return result;
  }

  private buildSectionWithNoLocations(list: ShoppingList) {
    let result = 'Unknown Location\n';
    list.itemsWithNoStoreLocation.forEach(item => {
      result = result.concat(`\t${item.name}\n`);
    });
    return result;
  }
}
