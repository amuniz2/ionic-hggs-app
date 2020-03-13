import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {UiCrudAction} from '../../../../ui-crud-actions';

export interface StoreAisleOrSection {
  groceryStoreId: number;
  name: string;
}

export interface StoreAisleOrSectionActionRequest {
  groceryStoreId: number;
  aisleOrSectionName: string;
  action: UiCrudAction;
}

@Component({
  selector: 'app-grocery-store-aisles-or-sections',
  templateUrl: './grocery-store-aisles-or-sections.component.html',
  styleUrls: ['./grocery-store-aisles-or-sections.component.scss']
})
export class GroceryStoreAislesOrSectionsComponent implements OnInit {
  newStoreAisleOrSection: string;

  @Input()
  addingAisleOrSection: boolean;

  @Output()
  notifyNewStoreAisleOrSectionRequested: EventEmitter<StoreAisleOrSectionActionRequest> = new EventEmitter();

  @Output()
  notifyDeleteStoreAisleOrSectionRequested: EventEmitter<StoreAisleOrSection> = new EventEmitter();

  @Input()
  groceryStore: GroceryStore;

  @Input()
  collectionName: string;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }
  onAddStoreAisleClick() {
    this.notifyNewStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: null,
      action: UiCrudAction.RequestCreate});
    this.newStoreAisleOrSection = '';
  }

  onCancelAddStoreAisleOrSectionClick() {
    this.notifyNewStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.newStoreAisleOrSection,
      action: UiCrudAction.Cancel});
    this.newStoreAisleOrSection = '';
  }

  onAddStoreAisleDoneClick() {
    this.notifyNewStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.newStoreAisleOrSection,
      action: UiCrudAction.Create});
    this.newStoreAisleOrSection = '';
  }

  editStoreAisle(name: string) {
    // this.store.dispatch( new NavigateToStoreDetailsPage({ id: item.id } ));
    // item.close();
  }
  remove(item: string) {
    console.log('emitting notifyDeleteStoreAisleRequested');
    this.notifyDeleteStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      name: item
    });
  }

  itemCanBeDeleted(groceryAisleOrSection: string) {

  }
}
