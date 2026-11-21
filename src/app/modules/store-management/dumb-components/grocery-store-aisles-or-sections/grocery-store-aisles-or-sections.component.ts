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

export interface UpdateStoreAisleOrSectionActionRequest extends StoreAisleOrSectionActionRequest {
  originalName: string;
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

  @Input()
  aislesOrSectionsInUse: string[];

  @Output()
  notifyNewStoreAisleOrSectionRequested: EventEmitter<StoreAisleOrSectionActionRequest> = new EventEmitter();

  @Output()
  notifyStartEditStoreAisleOrSectionRequested: EventEmitter<StoreAisleOrSectionActionRequest> = new EventEmitter();

  @Output()
  notifyEditStoreAisleOrSectionRequested: EventEmitter<UpdateStoreAisleOrSectionActionRequest> = new EventEmitter();

  @Output()
  notifyDeleteStoreAisleOrSectionRequested: EventEmitter<StoreAisleOrSection> = new EventEmitter();

  @Input()
  groceryStore: GroceryStore;

  @Input()
  collectionName: string;

  @Input()
  originalAisleOrSectionName: string;

  nameBeforeEdit: string;
  newName: string;
  singleCollectionItemName: string;

  constructor() {
  }

  ngOnInit() {
    this.singleCollectionItemName = this.collectionName.substr(0, this.collectionName.length - 1);
  }

  onCancelAddStoreAisleOrSectionClick() {
    this.notifyNewStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.newStoreAisleOrSection,
      action: UiCrudAction.Cancel});
    this.newStoreAisleOrSection = '';
  }

  onCancelEditStoreAisleOrSectionClick() {
    this.notifyEditStoreAisleOrSectionRequested.emit({
      originalName: '',
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.originalAisleOrSectionName,
      action: UiCrudAction.Cancel});
    this.newName = '';
  }
  onAddStoreAisleOrSectionDoneClick() {
    this.notifyNewStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.newStoreAisleOrSection,
      action: UiCrudAction.Create});
    this.newStoreAisleOrSection = '';
  }

  editStoreAisleOrSection(slidingItem, aisleName: string) {
    slidingItem.el.close();
    this.newName = this.originalAisleOrSectionName;
    this.nameBeforeEdit = aisleName;
    this.notifyStartEditStoreAisleOrSectionRequested.emit( {
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: aisleName,
      action: UiCrudAction.RequestUpdate
    });
    // item.close();
  }
  remove(item: string) {
    this.notifyDeleteStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      name: item
    });
  }

  itemCanBeDeleted(groceryAisleOrSection: string): boolean {
    return !this.aislesOrSectionsInUse.some(name => name === groceryAisleOrSection);
  }

  doneEditingItem() {
    if (this.originalAisleOrSectionName === this.newName) {
      return;
    }
    this.notifyEditStoreAisleOrSectionRequested.emit( {
      groceryStoreId: this.groceryStore.id,
      originalName: this.originalAisleOrSectionName,
      aisleOrSectionName: this.newName,
      action: UiCrudAction.Update
    });
    // this.itemBeingEdited = '';
  }
}
