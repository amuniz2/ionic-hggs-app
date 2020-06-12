import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {of} from 'rxjs';
import {
  CollapsedStatusChangedEvent,
  PageSection
} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {EditItemLocationRequest, NewItemLocationRequest} from '../pantry-item-locations/pantry-item-locations.component';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {UiCrudAction} from '../../../../ui-crud-actions';

@Component({
  selector: 'app-edit-pantry-item-details',
  templateUrl: './edit-pantry-item-details.component.html',
  styleUrls: ['./edit-pantry-item-details.component.scss']
})
export class EditPantryItemDetailsComponent implements OnInit {

  @Input()
  pantryItem: PantryItem;

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
  pantryItemQuantityUnit: string;

  locationsSection: PageSection = {
    label: 'Locations',
    isOpen$: of(true)
  };

  constructor() { }

  ngOnInit() {
    if (this.pantryItem != null) {
      this.pantryItemName = this.pantryItem.name;
      this.pantryItemDescription = this.pantryItem.description;
      this.pantryItemQuantity = this.pantryItem.defaultQuantity;
      this.pantryItemQuantityUnit = this.pantryItem.units;
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

  onNotifyDeleteLocationRequest($event) {
  }

  onAddLocationClicked() {
    this.notifyAddPantryItemLocationRequest.emit({ pantryItem: this.pantryItem, action: UiCrudAction.RequestCreate });
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
      inCart: this.pantryItem.inCart
    });
  }

  onDeletePantryItem() {
    // todo: emit notification to delete?
  }
}
