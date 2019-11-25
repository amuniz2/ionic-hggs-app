import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PantryItem} from '../../../../model/pantry-item';
import {NavigatedToPantryItemPage, NavigateToPantryItemPage} from '../../store/pantry-management.actions';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';

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
  styleUrls: ['./pantry-item-list.component.scss']
})
export class PantryItemListComponent implements OnInit {
  @Output()
  notifyDeletePantryItemRequested: EventEmitter<DeletePantryItemRequest> = new EventEmitter();

  @Input()
  pantryItemsLoading: boolean;

  @Input()
  pantryItems: PantryItem[];

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
  }}
