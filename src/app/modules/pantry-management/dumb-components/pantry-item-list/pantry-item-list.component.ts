import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
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
  styleUrls: ['./pantry-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PantryItemListComponent implements OnInit, OnChanges {
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

  constructor(private router: Router, private store: Store<AppState>, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('in onInit of pantry-item-list');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes: ', JSON.stringify(changes));
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
    console.log('ionChange event, pantryItem:');
    if (!isNaN($event.target.value)) {
      console.log(pantryItem);
      this.notifySavePantryItemRequested.emit({...pantryItem, quantityNeeded: $event.target.value });
    } else {
      console.log(`${$event.target.value} is not a number`);
    }
  }
}
