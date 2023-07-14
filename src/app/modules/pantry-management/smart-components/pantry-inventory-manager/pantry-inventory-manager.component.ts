import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromActions from '../../../pantry-management/store/pantry-management.actions';
import * as fromSelectors from '../../store/pantry-management.selectors';
import {
  DeletePantryItemRequest,
} from '../../../pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {PantryItem} from '../../../../model/pantry-item';
import {selectAllGroceryStores, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {GroceryStoreState} from '../../../../model/grocery-store';
import {AlertController, ToastController} from '@ionic/angular';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {GroceryDataExporter, HggsFile, IGroceryDataExporter} from '../../../../services/grocery-data-exporter.service';
import {HggsData} from '../../../../model/hggs-data';
import {IPantryDataService} from '../../../../services/IPantryDataService';
import {Router} from '@angular/router';
import {ImportData} from '../../../../store';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {IProductInfoService} from '../../../../services/IProductInfoService';
import {CreatePantryItemRequest} from '../../../../helpers';

@Component({
  selector: 'app-pantry-inventory-manager',
  templateUrl: './pantry-inventory-manager.component.html',
  styleUrls: ['./pantry-inventory-manager.component.scss'],
  providers: [GroceryDataExporter ]
})
export class PantryInventoryManagerComponent implements OnInit {
  title: string;
  pantryItems$: Observable<PantryItem[]>;
  pantryItemsLoading$: Observable<boolean>;
  error$: Observable<Error>;
  addingPantryItem$: Observable<boolean>;
  groceryStoresLoading$: Observable<boolean>;
  groceryStores$: Observable<GroceryStoreState[]>;
  private showSharingOptions: boolean;
  protected filterList: boolean;
  protected filter = '';

  @ViewChild('#tab-button-pantry-items')
  private pantryItemsTab: HTMLElement;

  constructor(private store: Store<AppState>,
              private socialSharing: SocialSharing,
              private toastController: ToastController,
              @Inject('IGroceryDataExporter')  private exporter: IGroceryDataExporter,
              @Inject('IPantryDataService')  private pantryDataService: IPantryDataService,
              private alertContoller: AlertController,
              private _cdr: ChangeDetectorRef,
              private router: Router,
              private scanner: BarcodeScanner,
              @Inject('IProductInfoService') private productInfoService: IProductInfoService) {
    this.title = 'Manage pantry items from page component';
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.store.dispatch(new fromActions.LoadPantryItems());
    this.pantryItemsLoading$ = this.store.pipe(select(fromSelectors.selectPantryItemsLoading));
    this.groceryStores$ = this.store.pipe(select(selectAllGroceryStores));
    this.showSharingOptions = false;
    this.filterList = false;
  }

  ngOnInit() {
    this.pantryItems$ = this.store.pipe(select(fromSelectors.selectAllPantryItems));
    this.error$ = this.store.pipe(select(fromSelectors.selectPantryItemsError));
  }

  onDeletePantryItemRequest($event: DeletePantryItemRequest) {
    console.log('dispatching deletePantrItem event');
    console.log($event);
    this.store.dispatch(new fromActions.DeletePantryItem($event));
  }

  onAddPantryItemClick() {
    this.addingPantryItem$ = of(true);
    // this.store.dispatch(new fromActions.CreatePantryItem({newItem: true, id: 0}));
  }

  onCreateItem($event: CreatePantryItemRequest) {
    this.addingPantryItem$ = of(false);
    if ($event.name) {
      this.store.dispatch(new fromActions.CreatePantryItem($event));
    }
  }

  onPantryItemModified($event: PantryItem) {
    this.store.dispatch(new fromActions.SavePantryItem($event));
  }

  onCheckDefaultItems() {
    this.store.dispatch(new fromActions.SelectDefaultPantryItems(true));
  }

  onScanBarcode() {
    this.scanner.scan().then(barcodeData => {
      this.productInfoService.getProductInfo(barcodeData).subscribe((productInfo) => {
          console.log(productInfo);
          const scannedProductInfo = this.productInfoService.convertToProductData(productInfo);
          if (!!scannedProductInfo && scannedProductInfo.length > 0) {
            this.store.dispatch(new fromActions.CreatePantryItem( { name: scannedProductInfo[0].name }));
          }
        },
        (error) => console.log('error: ', error));
    }).catch(err => {
      console.log('Error', err);
    });
  }

  onShopClick() {

  }

  groceryStoresExist() {

  }

  // async settingsPopover(ev: any) {
  //   const popover = await this.popoverController.create({
  //     component: SharingComponent,
  //     event: ev,
  //     componentProps: {page: 'Login'},
  //     cssClass: 'popover_class',
  //   });
  //
  //   /** Sync event from popover component */
  //   //   this.events.subscribe(''fromPopoverEvent', () => {
  //   //   this.syncTasks();
  //   // });
  //   return await popover.present();
  // }

  private async onSuccessExport(result) {
    const toast = await this.toastController.create({message: 'List shared.', duration: 2000});
    await toast.present();
  };

  private async onExportError(err) {
    const toast = await this.toastController.create({message: `Email failed to send with error: ${JSON.stringify(err)}.`, duration: 10000});
    await toast.present();
  };

  async presentSharingOptions(ev: any) {
    this.exporter.exportAll().subscribe(fileName => {
      console.log(`file name returned: ${fileName}`)
      this.socialSharing.shareWithOptions({
        subject: 'Grocery shopping list',
        chooserTitle: 'Select how to send grocery list',
        message: 'Here is the list',
        files: [fileName]
      }).then(async r => await this.onSuccessExport(r)).catch(async err => await this.onExportError(err));
    });
    }

    private async notifyNoImportFileAvailable() {
      const alert = await this.alertContoller.create({
        message: 'No file is available for import.',
        buttons: [
          {
            text: 'Okay',
            role: 'cancel',
            handler: () => {
              console.log('Okay clicked');
            }
          }
        ],
      });
      await alert.present();
    }

    private importDataRead = async (data:string, state: any) => {
      // console.log('routing before dispatching');
      // await this.router.navigateByUrl('/home/pantry-items');
      console.log('data read from file: ', data);
        this.store.dispatch(new ImportData(JSON.parse(data), '/home/pantry-items'));
    }

    private async confirm(hggsFile: HggsFile) {
      const alert = await this.alertContoller.create({
        message: `Import data from ${hggsFile.name}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Import',
            handler: async () => {
              this.exporter.dataHandler = this.importDataRead;
              await this.exporter.importFromFile(hggsFile, {store: this.store, _cdr: this._cdr, router: this.router }).toPromise();
            }
          }
        ],
      });
      await alert.present();
    }

    async importData() {
    
    this.exporter.getFilesAvailableToDownload().subscribe(
      async hggsFiles => {
        if (hggsFiles.length === 0) {
          await this.notifyNoImportFileAvailable();
        } else if (hggsFiles.length === 1) {
          console.log('found file, prompting for confirmation');
          await this.confirm(hggsFiles[0]);
        } else {
          console.log('todo: prompt user to choose which file, or process most recent file');
        }
      });
  }

  filterItems() {
    this.filterList = true;
  }

  cancelFilter() {
    this.filterList = false;
  }

  onAddOrRemoveFromShoppingList($event: PantryItem) {
    this.store.dispatch(new fromActions.ToggleNeed($event));
  }
}
