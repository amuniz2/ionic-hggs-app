import {ChangeDetectorRef, Component, Inject, Injectable, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromActions from '../../../pantry-management/store/pantry-management.actions';
import * as fromSelectors from '../../store/pantry-management.selectors';
import {
  CreatePantryItemRequest,
  DeletePantryItemRequest,
  NavigateToEditPantryItemRequest
} from '../../../pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {PantryItem} from '../../../../model/pantry-item';
import {selectAllGroceryStores, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {GroceryStoreState} from '../../../../model/grocery-store';
import {AlertController, ToastController} from '@ionic/angular';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {HggsFile, IGroceryDataTransporter} from '../../../../services/grocery-data-transporter.service';
import {File} from  '@ionic-native/file/ngx';
import {DataImported} from '../../../../store';
import {HggsData} from '../../../../model/hggs-data';
import {IPantryDataService} from '../../../../services/IPantryDataService';

@Component({
  selector: 'app-pantry-inventory-manager',
  templateUrl: './pantry-inventory-manager.component.html',
  styleUrls: ['./pantry-inventory-manager.component.scss']
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

  constructor(private store: Store<AppState>,
              private socialSharing: SocialSharing,
              private toastController: ToastController,
              private fileManager: File,
              @Inject('IGroceryDataExporter')  private dataTransporter: IGroceryDataTransporter,
              @Inject('IPantryDataService')  private pantryDataService: IPantryDataService,
              private alertContoller: AlertController,
              private _cdr: ChangeDetectorRef
              /*private popoverController: PopoverController, */) {
    this.title = 'Manage pantry items from page component';
    // this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    console.log('dispatching NavigatedToPantryPage');
    this.store.dispatch(new fromActions.LoadPantryItems());
    this.pantryItemsLoading$ = this.store.pipe(select(fromSelectors.selectPantryItemsLoading));
    this.groceryStores$ = this.store.pipe(select(selectAllGroceryStores));
    this.showSharingOptions = false;
  }

  ngOnInit() {
    // dispatch action that list has been navigated to
    this.pantryItems$ = this.store.pipe(select(fromSelectors.selectAllPantryItems));
    this.error$ = this.store.pipe(select(fromSelectors.selectPantryItemsError));
  }

  onDeletePantryItemRequest($event: DeletePantryItemRequest) {
    console.log('dispatching deletePantrItem event');
    console.log($event);
    this.store.dispatch(new fromActions.DeletePantryItem($event));
  }

  onAddStoreClick() {
    this.addingPantryItem$ = of(true);
    // console.log('dispatching createPantryItem event');
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

  private async onSuccess(result) {
    console.log(`return from sharing ${JSON.stringify(result)}`);
    const toast = await this.toastController.create({message: 'List shared.', duration: 2000});
    await toast.present();
  };

  private async onError(err) {
    console.log(`error occured when sharing: ${JSON.stringify(err)}`);
    const toast = await this.toastController.create({message: `Email failed to send with error: ${JSON.stringify(err)}.`, duration: 5000});
    await toast.present();
  };

  async presentSharingOptions(ev: any) {
    // const popover = await this.popoverController.create({
    //   component: ShareComponent,
    //   cssClass: 'my-custom-class',
    //   event: ev,
    //   translucent: true
    // });
    // return await popover.present();

      // this.events.publish('event data');

    this.dataTransporter.exportAll().subscribe(fileName => {
      console.log(`file name returned: ${fileName}`)
      this.socialSharing.shareWithOptions({
        subject: 'Grocery shopping list',
        files: [fileName]
      }).then(async r => await this.onSuccess(r)).catch(async err => await this.onError(err));
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

    private importDataRead(data: HggsData, state: any) {
        this.pantryDataService.importHggsData(data)
          .subscribe((succeeded) => {
          console.log(`import returned: ${succeeded}`);
          console.log('dispatching LoadPantryItems');
          state.store.dispatch(new fromActions.LoadPantryItems());
          state._cdr.detectChanges();
        });
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
            handler: () => {
              console.log('Yes, Import');
              this.dataTransporter.dataHandler = this.importDataRead;
              this.dataTransporter.importFromFile(hggsFile, {store: this.store, _cdr: this._cdr }).subscribe(succeeded => {
                console.log('import result: ', succeeded);
                console.log('dispatching LoadPantryItems action');
                this.store.dispatch(new fromActions.LoadPantryItems());
              });
              console.log('Import call made');
            }
          }
        ],
      });
      await alert.present();
    }

  async importData() {
    this.dataTransporter.getFilesAvailableToDownload().subscribe(
      async hggsFiles => {
        if (hggsFiles.length === 0) {
          this.notifyNoImportFileAvailable();
        } else if (hggsFiles.length === 1) {
          await this.confirm(hggsFiles[0]);
        } else {
          console.log('choose which file');
        }
      }, error => {});
  }
}
