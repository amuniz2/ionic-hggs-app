import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {ControlContainer, FormControl} from '@angular/forms';
import {ModalController, PopoverController} from '@ionic/angular';
import {AddGroceryStoreComponent} from '../../../store-management/dumb-components/add-grocery-store/add-grocery-store';
import {AddGroceryStoreModalComponent} from '../../add-grocery-store-modal/add-grocery-store-modal.component';

@Component({
  selector: 'app-grocery-store-location-store',
  templateUrl: './grocery-store-location-store.component.html',
  styleUrls: ['./grocery-store-location-store.component.scss']
})
export class GroceryStoreLocationStoreComponent implements OnInit {

  @Input()
  groceryStores: GroceryStore[];

  @Input()
  selectedGroceryStore: GroceryStore;

  @Input()
  groceryStoreIdsItemIsLocatedIn: number[];

  @Output()
  selectedGroceryStoreChange: EventEmitter<GroceryStore> = new EventEmitter<GroceryStore>();

  private possibleGroceryStores: GroceryStore[];
  constructor(public controlContainer: ControlContainer,
              public modalController: ModalController,
              private popoverController: PopoverController) {
  }

  ngOnInit() {
    if (this.selectedGroceryStore != null) {
      this.possibleGroceryStores = this.groceryStores.filter(groceryStore =>
        this.selectedGroceryStore.id === groceryStore.id || !this.groceryStoreIdsItemIsLocatedIn.some(id => id === groceryStore.id))
    } else {
      this.possibleGroceryStores = this.groceryStores.filter(groceryStore => !this.groceryStoreIdsItemIsLocatedIn.some(id => id === groceryStore.id));
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
    // todo: display popover prompting for new grocery store name
    // await this.addGroceryStorePopover($event);
    await this.presentModal();
  }

  async addGroceryStorePopover(ev: any) {
    const popover = await this.popoverController.create({
      component: AddGroceryStoreComponent,
      event: ev,
      componentProps: {},
      cssClass: 'popover_class',
    });

    /** Sync event from popover component */
    //   this.events.subscribe(''fromPopoverEvent', () => {
    //   this.syncTasks();
    // });
    return await popover.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddGroceryStoreModalComponent,
      cssClass: 'add-grocery-store-modal'
    });
    return await modal.present();
  }
}
