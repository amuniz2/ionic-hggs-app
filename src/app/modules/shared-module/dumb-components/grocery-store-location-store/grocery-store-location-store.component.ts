import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {ControlContainer, FormControl} from '@angular/forms';
import {ModalController, PopoverController} from '@ionic/angular';
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
  selectedGroceryStore: GroceryStore;

  @Input()
  groceryStoreIdsItemIsLocatedIn: number[];

  @Output()
  selectedGroceryStoreChange: EventEmitter<GroceryStore> = new EventEmitter<GroceryStore>();

  @Output()
  selectedNewGroceryStoreChange: EventEmitter<string> = new EventEmitter<string>();

  private possibleGroceryStores: GroceryStore[];
  constructor(public controlContainer: ControlContainer,
              public modalController: ModalController) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedGroceryStore || changes.groceryStores) {
      if (this.selectedGroceryStore != null) {
        this.possibleGroceryStores = this.groceryStores.filter(groceryStore =>
          this.selectedGroceryStore.id === groceryStore.id || !this.groceryStoreIdsItemIsLocatedIn.some(id => id === groceryStore.id))
      } else {
        this.possibleGroceryStores = this.groceryStores;
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
}
