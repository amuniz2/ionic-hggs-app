import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DoCheck,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {NavigateToPantryItemPage} from '../../store/pantry-management.actions';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {GroceryStoreLocation} from "../../../../model/grocery-store-location";

export interface DeletePantryItemRequest {
  id: number;
}

export interface NavigateToEditPantryItemRequest {
  id: number;
  newItem: boolean;
}

@Component({
  selector: 'app-pantry-item-list',
  templateUrl: './pantry-item-list.component.html',
  styleUrls: ['./pantry-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PantryItemListComponent {
  @Output()
  notifyAddOrRemoveFromShoppingList: EventEmitter<PantryItem> = new EventEmitter<PantryItem>();

  @Output()
  notifyDeletePantryItemRequested: EventEmitter<DeletePantryItemRequest> = new EventEmitter();

  @Output()
  notifySavePantryItemRequested: EventEmitter<PantryItem> = new EventEmitter();

  @Input()
  pantryItemsLoading: boolean;

  @Input()
  pantryItems: PantryItem[];

  @Input()
  error: Error;

  @Input()
  filter: string;

  private get filteredPantryItems() {
    if (!!this.filter) {
      const lowerCaseFilter = this.filter.toLowerCase();
      return this.pantryItems.filter(item => item.name?.toLowerCase().includes(lowerCaseFilter) || item.description?.toLowerCase().includes(lowerCaseFilter));
    }
    return this.pantryItems;
  }

  constructor(private router: Router, private store: Store<AppState>, private cd: ChangeDetectorRef) { }

  editPantryItem(item: PantryItem) {
    this.store.dispatch( new NavigateToPantryItemPage({ id: item.id, newItem: false }));
    // item.close();
  }
  remove(item: PantryItem) {
    this.notifyDeletePantryItemRequested.emit({ id: item.id});
  }

  onCreateShoppingList() {

  }

  itemClicked($event, pantryItem: PantryItem) {
    console.log('emitting event: ', {...pantryItem, need: $event?.detail?.checked, inCart: false});
     this.notifyAddOrRemoveFromShoppingList.emit({...pantryItem, need: $event?.detail?.checked, inCart: false});
    // this.notifySavePantryItemRequested.emit({...pantryItem, need: $event?.detail?.checked, inCart: false});
  }

  quantityChanged($event, pantryItem: PantryItem) {
    if (!isNaN($event.target.value)) {
      this.notifySavePantryItemRequested.emit({...pantryItem, quantityNeeded: $event.target.value });
    }
  }
}
