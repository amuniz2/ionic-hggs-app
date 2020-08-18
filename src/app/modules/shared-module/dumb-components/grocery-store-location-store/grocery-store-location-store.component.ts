import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {ControlContainer} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {AddGroceryStoreModalComponent} from '../../add-grocery-store-modal/add-grocery-store-modal.component';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-grocery-store-location-store',
  templateUrl: './grocery-store-location-store.component.html',
  styleUrls: ['./grocery-store-location-store.component.scss']
})
export class GroceryStoreLocationStoreComponent implements OnInit, OnChanges {

  @Input()
  groceryStores: GroceryStore[];

  @Input()
  editingExistingStoreLocation: boolean;

  @Input()
  selectedGroceryStore: GroceryStore;

  @Input()
  groceryStoreIdsItemIsLocatedIn: number[];

  @Output()
  selectedGroceryStoreChange: EventEmitter<GroceryStore> = new EventEmitter<GroceryStore>();

  @Output()
  selectedNewGroceryStoreChange: EventEmitter<string> = new EventEmitter<string>();

  private possibleGroceryStores: GroceryStore[];
  private : boolean;
  constructor(public controlContainer: ControlContainer,
              public modalController: ModalController) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes: ');
    console.log(changes);
    if (changes.selectedGroceryStore || changes.groceryStores) {
      if (this.editingExistingStoreLocation && changes.selectedGroceryStore && changes.selectedGroceryStore.currentValue) {
        this.possibleGroceryStores = [changes.selectedGroceryStore.currentValue];
        // this.selectedGroceryStore = changes.selectedGroceryStore.currentValue;
      } else {
          this.possibleGroceryStores = this.groceryStores.filter(groceryStore =>
            !this.groceryStoreIdsItemIsLocatedIn.some(id => id === groceryStore.id))
      }
    }
  }

  onChangeGroceryStoreSelected($event: CustomEvent) {
    // if ((this.selectedGroceryStore == null ) || ($event.detail.value.id !== this.selectedGroceryStore.id)) {
      this.selectedGroceryStoreChange.emit($event.detail.value);
    // }
    // this.selectedGroceryStoreChange.emit({ id: $event.id });
  }

  compareById(store1: GroceryStore, store2: GroceryStore) {
    return store1.id === store2.id;
  }

  async onAddGroceryStore ($event: CustomEvent) {
    await this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddGroceryStoreModalComponent,
      componentProps: {
        componentDesc: 'Store'
      },
      cssClass: 'add-grocery-store-modal'
    });

    modal.present();

    const dataReturned = await modal.onDidDismiss();
    if (!dataReturned.data.cancelled) {
      this.selectedNewGroceryStoreChange.emit(dataReturned.data.storeName);
    }
  }

  getPlaceholderText(): string {
    return this.possibleGroceryStores?.length === 0 ?  'No Grocery Stores Available' : 'Select Grocery Store';
  }

}
