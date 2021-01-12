import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {of} from 'rxjs';
import {
  CollapsedStatusChangedEvent,
  PageSection
} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {UiCrudAction} from '../../../../ui-crud-actions';
import {GroceryStoreState} from '../../../../model/grocery-store';
import {
  EditItemLocationRequest,
  NewItemLocationRequest
} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';

@Component({
  selector: 'app-edit-shopping-item-details',
  templateUrl: './edit-shopping-item-details.component.html',
  styleUrls: ['./edit-shopping-item-details.component.scss']
})
export class EditShoppingItemDetailsComponent implements OnInit, OnChanges {

  @Input()
  pantryItem: PantryItem;

  @Input()
  groceryStores: GroceryStoreState[];

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
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pantryItem) {
      this.pantryItemDescription = changes.pantryItem.currentValue.description;
      this.pantryItemName = changes.pantryItem.currentValue.name;
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

  onNotifyEditLocationRequest($event) {
    this.notifyEditPantryItemLocationRequest.emit($event);
  }

  // onAddLocationClicked() {
  //   this.notifyAddPantryItemLocationRequest.emit({
  //     pantryItem: this.pantryItem,
  //     action: UiCrudAction.RequestCreate,
  //     existingLocations: this.pantryItemLocations
  //   });
  // }

  private updateItem() {
    let pantryItem = this.pantryItem;
    if (pantryItem === null) {
      pantryItem = new PantryItem();
    }
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
      inCart: this.pantryItem.inCart
    });
  }

  onNotifyAddLocationRequest($event) {

  }
}
