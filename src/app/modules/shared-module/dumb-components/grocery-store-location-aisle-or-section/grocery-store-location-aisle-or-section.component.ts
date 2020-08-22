import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {ControlContainer, Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GroceryStore} from '../../../../model/grocery-store';
import {AddGroceryStoreModalComponent} from '../../add-grocery-store-modal/add-grocery-store-modal.component';
import {ModalController} from '@ionic/angular';
import {IonicSelectableComponent} from 'ionic-selectable';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';

export interface GroceryStoreAisleOrSectionSelected {
  name: string;
}

export interface RenameAisleOrSection {
  previousAisleOrSectionName: string;
  newAisleOrSectionName: string;
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
  deleteAisleOrSection: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  selectedNewGroceryStoreAisleOrSectionChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  renameAisleOrSection: EventEmitter<RenameAisleOrSection> = new EventEmitter<RenameAisleOrSection>();
  @Input()
  selectedGroceryStoreAisleOrSection: string;

  @Input()
  groceryStoreLocations : GroceryStoreLocation[];

  @ViewChild('selectableComponent') selectableComponent: IonicSelectableComponent;

  private editControl: FormControl;
  private readonly editControlForm: FormGroup;
  private itemBeingEdited: string;

  constructor(private controlContainer: ControlContainer,
              public modalController: ModalController,
              private fb: FormBuilder) {
    // Create port form that will be used to add or save port.
    this.editControl = this.fb.control(['', Validators.required]);
    this.editControlForm = this.fb.group({
      editControl: this.editControl
    });
  }


  onChangeAisleOrSection($event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.changeSelection($event.value);
  }

  onEditAisleOrSection(event: {
    component: IonicSelectableComponent,
    item: string
  }) {
    // Fill form.
    this.itemBeingEdited = event.item;
    this.editControl.setValue(event.item);

    // Show form.
    this.selectableComponent.endSearch();
    event.component.showAddItemTemplate();
  }

  sectionsOrAislesExist(): boolean {
    return this.groceryStoreAislesOrSections?.length > 0;
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

  private deleteSelection(valueToDelete: string) {
    // this.selectedGroceryStoreAisleOrSection = newValue;
    this.deleteAisleOrSection.emit(valueToDelete);
  }

  saveItem(itemToSave: string){
    const renameItemEvent = {
      previousAisleOrSectionName: this.itemBeingEdited,
      newAisleOrSectionName: this.editControl.value
    };
    this.renameAisleOrSection.emit(renameItemEvent);
    console.log('emitting event to rename aisle or component');
    console.log(renameItemEvent);

    console.log('editControl: ');
    console.log(this.editControl);

    console.log('itemToSave: ');
    console.log(itemToSave);

    console.log('itemBeingEdited: ');
    console.log(this.itemBeingEdited);

    console.log('editControlForm: ');
    console.log(this.editControlForm);

    this.itemBeingEdited = '';
    this.selectableComponent.hideAddItemTemplate();
  }

  getPlaceholderText(): string {
    return this.sectionsOrAislesExist() ? `Select Grocery Store ${this.label}` : `No ${this.label}s defined`;
  }

}

