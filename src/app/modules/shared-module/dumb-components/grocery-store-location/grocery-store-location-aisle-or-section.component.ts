import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {GroceryStore} from '../../../../model/grocery-store';
import {AddGroceryStoreModalComponent} from '../../add-grocery-store-modal/add-grocery-store-modal.component';
import {ModalController} from '@ionic/angular';
import {IonicSelectableComponent} from 'ionic-selectable';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';

export interface GroceryStoreAisleOrSectionSelected {
  name: string;
}
@Component({
  selector: 'app-grocery-store-location-aisle-or-section',
  templateUrl: './grocery-store-location-aisle-or-section.component.html',
  styleUrls: ['./grocery-store-location-aisle-or-section.component.scss']
})
export class GroceryStoreLocationAisleOrSectionComponent {

  @Input()
  inputControlName: string;

  @Input()
  label: string;

  @Input()
  groceryStores: GroceryStore[];

  @Input()
  groceryStoreAislesOrSections: string[];

  @Output()
  aisleOrSectionChange: EventEmitter<GroceryStoreAisleOrSectionSelected> = new EventEmitter<GroceryStoreAisleOrSectionSelected>();

  @Output()
  selectedNewGroceryStoreAisleOrSectionChange: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  selectedGroceryStoreAisleOrSection: string;

  @Input()
  groceryStoreLocations : GroceryStoreLocation[];

  constructor(private controlContainer: ControlContainer,
              public modalController: ModalController) { }


  onChangeAisleOrSection($event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.changeSelection($event.value);
  }

  sectionsOrAislesExist(): boolean {
    return this.groceryStoreAislesOrSections !== null && this.groceryStoreAislesOrSections.length > 0;
  }

  async onAddGroceryStoreAisleOrSection() {
    await this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddGroceryStoreModalComponent,
      componentProps: {
        componentDesc: this.label
      },
      cssClass: 'add-grocery-store-modal'
    });

    modal.present();

    const dataReturned = await modal.onDidDismiss();
    if (!dataReturned.data.cancelled) {
      this.selectedNewGroceryStoreAisleOrSectionChange.emit(dataReturned.data.storeName);
      // this.changeSelection(dataReturned.data.storeName);
    }
  }

  private changeSelection(newValue: string) {
    // this.selectedGroceryStoreAisleOrSection = newValue;
    this.aisleOrSectionChange.emit({name: newValue} );
  }

  getPlaceholderText(): string {
    return this.sectionsOrAislesExist() ? `Select Grocery Store ${this.label}` : `No ${this.label}s defined`;
  }
}

