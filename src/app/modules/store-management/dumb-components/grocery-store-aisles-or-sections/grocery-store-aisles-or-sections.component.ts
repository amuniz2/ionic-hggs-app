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
  itemBeingEdited: string;

  nameBeforeEdit: string;
  newName: any;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
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
      originalName: "",
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.itemBeingEdited,
      action: UiCrudAction.Cancel});
    this.newName = '';
  }
  onAddStoreAisleDoneClick() {
    this.notifyNewStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: this.newStoreAisleOrSection,
      action: UiCrudAction.Create});
    this.newStoreAisleOrSection = '';
  }

  editStoreAisle(slidingItem, asileName: string) {
    slidingItem.el.close();
    this.newName = asileName;
    this.nameBeforeEdit = asileName;
    this.notifyStartEditStoreAisleOrSectionRequested.emit( {
      groceryStoreId: this.groceryStore.id,
      aisleOrSectionName: asileName,
      action: UiCrudAction.RequestUpdate
    });
    // item.close();
  }
  remove(item: string) {
    console.log('emitting notifyDeleteStoreAisleRequested');
    this.notifyDeleteStoreAisleOrSectionRequested.emit({
      groceryStoreId: this.groceryStore.id,
      name: item
    });
  }

  itemCanBeDeleted(groceryAisleOrSection: string): boolean {
    return !this.aislesOrSectionsInUse.some(name => name === groceryAisleOrSection);
  }

  doneEditingItem() {
    if (this.itemBeingEdited === this.newName) {
      return;
    }
    this.notifyEditStoreAisleOrSectionRequested.emit( {
      groceryStoreId: this.groceryStore.id,
      originalName: this.itemBeingEdited,
      aisleOrSectionName: this.newName,
      action: UiCrudAction.Update
    });
    // this.itemBeingEdited = '';
  }

  isItemBeingEdited(current: string): boolean {
    return this.itemBeingEdited && current === this.nameBeforeEdit && this.itemBeingEdited === this.nameBeforeEdit;
  }
}
