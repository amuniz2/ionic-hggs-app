import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {of} from 'rxjs';
import {
  CollapsedStatusChangedEvent,
  PageSection
} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {EditItemLocationRequest, NewItemLocationRequest} from '../pantry-item-locations/pantry-item-locations.component';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {UiCrudAction} from '../../../../ui-crud-actions';
import {GroceryStoreState} from '../../../../model/grocery-store';

@Component({
  selector: 'app-edit-pantry-item-details',
  templateUrl: './edit-pantry-item-details.component.html',
  styleUrls: ['./edit-pantry-item-details.component.scss']
})
export class EditPantryItemDetailsComponent implements OnInit, OnChanges {

  @Input()
  pantryItem: PantryItem;

  @Input()
  groceryStores: GroceryStoreState[];

  @Input()
  pantryItemLocations: GroceryStoreLocation[];

  @Input()
  error: Error;

  @Output()
  notifySavePantryItemRequested: EventEmitter<PantryItem> = new EventEmitter();

  @Output()
  notifyAddPantryItemRequested: EventEmitter<PantryItem> = new EventEmitter();

  @Output()
  notifyAddPantryItemLocationRequest: EventEmitter<NewItemLocationRequest> = new EventEmitter();

  @Output()
  notifyEditPantryItemLocationRequest: EventEmitter<EditItemLocationRequest> = new EventEmitter();

  pantryItemName: string;
  pantryItemDescription: string;
  pantryItemQuantity: number;
  defaultItem: boolean;
  pantryItemQuantityUnit: string;

  locationsSection: PageSection = {
    label: 'Locations',
    isOpen$: of(true)
  };
  itemCanExistInOtherStores: boolean;

  constructor() { }

  ngOnInit() {
    if (this.pantryItem != null) {
      this.pantryItemName = this.pantryItem.name;
      this.pantryItemDescription = this.pantryItem.description;
      this.pantryItemQuantity = this.pantryItem.defaultQuantity;
      this.pantryItemQuantityUnit = this.pantryItem.units;
      this.defaultItem = this.pantryItem.selectByDefault;
      // include this in ngOnChanges?
      this.itemCanExistInOtherStores = this.groceryStores.length > this.pantryItemLocations.length;
    } else {
      this.itemCanExistInOtherStores = this.groceryStores.length > 0;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.pantryItem != null) {
      this.itemCanExistInOtherStores = this.groceryStores.length > this.pantryItemLocations.length;
    } else {
      this.itemCanExistInOtherStores = this.groceryStores.length > 0;
    }
    if (changes.pantryItem) {
      this.pantryItemDescription = changes.pantryItem.currentValue.description;
      this.pantryItemName = changes.pantryItem.currentValue.name;
      this.defaultItem = changes.pantryItem.currentValue.selectByDefault;
    }
  }

  onNameEnteredOrChanged() {
    if (this.pantryItem.id != null && this.pantryItem.id > 0) {
      this.updateItem();
    } else {
      this.notifyAddPantryItemRequested.emit({
        ...new PantryItem(),
        name: this.pantryItemName,
        description: this.pantryItemDescription,
      });
    }
  }

  onPropertyChange() {
    this.updateItem();
  }

  toggleLocationsSection($event: CollapsedStatusChangedEvent) {
    this.locationsSection.isOpen$ = of($event.isOpen);
    // if ($event.isOpen && this.pantryItem.locations.length === 0) {
    //   this.notifyExpandLocations.emit(this.pantryItem.id);
    // }
  }

  onNotifyEditLocationRequest($event) {
    this.notifyEditPantryItemLocationRequest.emit($event);
  }

  onAddLocationClicked() {
    this.notifyAddPantryItemLocationRequest.emit({
      pantryItem: this.pantryItem,
      action: UiCrudAction.RequestCreate,
      existingLocations: this.pantryItemLocations
    });
  }

  private updateItem() {
    let pantryItem = this.pantryItem;
    if (pantryItem === null) {
      pantryItem = new PantryItem();
    }
    console.log('emitting notfiySavePantryItemRequested');
    this.notifySavePantryItemRequested.emit({
      ...pantryItem,
      name: this.pantryItemName,
      description: this.pantryItemDescription,
      id: this.pantryItem.id,
      locations: this.pantryItem.locations,
      quantityNeeded: this.pantryItemQuantity,
      defaultQuantity: this.pantryItemQuantity,
      // quantityNeeded: (pantryItem.quantityNeeded === 0) ? this.pantryItemQuantity : pantryItem.quantityNeeded,
      units: this.pantryItemQuantityUnit,
      need: this.pantryItem.need,
      inCart: this.pantryItem.inCart,
      selectByDefault: this.defaultItem
    });
  }
}
