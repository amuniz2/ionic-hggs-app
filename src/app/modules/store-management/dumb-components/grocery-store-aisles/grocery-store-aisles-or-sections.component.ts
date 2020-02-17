import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';

export enum Action {
  RequestCreate = 1,
  Create,
  Delete ,
  RequestUpdate,
  Update,
  Cancel
}
export interface StoreAisleOrSection {
  groceryStoreId: number;
  name: string;
}

export interface StoreAisleOrSectionActionRequest {
  groceryStoreId: number;
  aisleOrSectionName: string;
  action: Action;
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
      action: Action.RequestCreate});
    this.newStoreAisleOrSection = '';
  }

  onCancelAddStoreAisleOrSectionClick() {
    this.notifyNewStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.newStoreAisleOrSection,
      action: Action.Cancel});
    this.newStoreAisleOrSection = '';
  }

  onAddStoreAisleDoneClick() {
    this.notifyNewStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.newStoreAisleOrSection,
      action: Action.Create});
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
}
