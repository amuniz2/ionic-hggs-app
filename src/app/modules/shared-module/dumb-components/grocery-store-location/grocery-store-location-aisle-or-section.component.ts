import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {GroceryStore} from '../../../../model/grocery-store';
import {AddGroceryStoreModalComponent} from '../../add-grocery-store-modal/add-grocery-store-modal.component';
import {ModalController} from '@ionic/angular';

export interface GroceryStoreAisleOrSectionSelected {
  name: string;
}
@Component({
  selector: 'app-grocery-store-location-aisle-or-section',
  templateUrl: './grocery-store-location-aisle-or-section.component.html',
  styleUrls: ['./grocery-store-location-aisle-or-section.component.scss']
})
export class GroceryStoreLocationAisleOrSectionComponent implements OnInit, OnChanges {

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

  @Output()
  selectedNewGroceryStoreComponentChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private controlContainer: ControlContainer,
              public modalController: ModalController) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      console.log('changes for sections or ailes:');
      console.log(changes);
  }

  onChangeAisleOrSection($event: CustomEvent) {
    this.changeSelection($event.detail.value);
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
      this.changeSelection(dataReturned.data.storeName);
    }
  }

  private changeSelection(newValue: string) {
    this.selectedGroceryStoreAisleOrSection = newValue;
    this.aisleOrSectionChange.emit({name: newValue} );
  }

}

