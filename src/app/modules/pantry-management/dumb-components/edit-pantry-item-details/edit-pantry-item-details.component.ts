import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {Observable, of} from 'rxjs';
import {
  AddButtonClickedEvent,
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
  isNewItem: boolean;

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

  locationsSection: PageSection = {
    label: 'Locations',
    isOpen$: of(false)
  };

  constructor() { }

  ngOnInit() {
    if (this.pantryItem != null) {
      this.pantryItemName = this.pantryItem.name;
      this.pantryItemDescription = this.pantryItem.description;
    }
  }

  onSaveClick() {
    if (!this.isNewItem) {
      // add new item
      this.notifySavePantryItemRequested.emit({
        name: this.pantryItemName,
        description: this.pantryItemDescription,
        id: this.pantryItem.id,
        locations: this.pantryItem.locations
      });
    } else {
      // update existing item
      this.notifyAddPantryItemRequested.emit({name: this.pantryItemName, description: this.pantryItemDescription, id: 0, locations: []});
    }
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

}
