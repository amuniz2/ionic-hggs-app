import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {NavigateToPantryItemPage} from '../../store/pantry-management.actions';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';

export interface DeletePantryItemRequest {
  id: number;
}

export interface CreatePantryItemRequest {
  name: string;
}

export interface NavigateToEditPantryItemRequest {
  id: number;
  newItem: boolean;
}
@Component({
  selector: 'app-pantry-item-list',
  templateUrl: './pantry-item-list.component.html',
  styleUrls: ['./pantry-item-list.component.scss']
})
export class PantryItemListComponent implements OnInit {
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

  constructor(private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
  }

  editPantryItem(item: PantryItem) {
    this.store.dispatch( new NavigateToPantryItemPage({ id: item.id, newItem: false }));
    // item.close();
  }
  remove(item: PantryItem) {
    console.log(`emitting notification that pantry item delete is requested ${item.id}`);
    this.notifyDeletePantryItemRequested.emit({ id: item.id});
  }

  onCreateShoppingList() {

  }

  itemClicked($event, pantryItem: PantryItem) {
    console.log('item clicked');
    console.log($event);

    this.notifySavePantryItemRequested.emit({...pantryItem, need: $event?.detail?.checked, inCart: false});
  }

  quantityChanged($event, pantryItem: PantryItem) {
    if (!isNaN($event.detail?.value)) {
      console.log('ionChange event, pantryItem:');
      console.log(pantryItem);
      // this.notifySavePantryItemRequested.emit({...pantryItem, quantityNeeded: $event.detail.value });
    }
  }
}
