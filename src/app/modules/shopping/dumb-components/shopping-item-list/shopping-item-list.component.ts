import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';
import {
  EditItemLocationRequest
} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';
import {UiCrudAction} from '../../../../ui-crud-actions';
import {CreateShoppingItemRequest} from '../../store/shopping.actions';
import {GroceryStore} from '../../../../model/grocery-store';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {Aisle, ShoppingItemGroup, ShoppingList} from '../../../../model/shopping-list';
import {buildShoppingList} from '../../shopping-helpers';

export interface AddPantryItemToStoreShoppingList {
  aisle: Aisle;
}

export class StoreShoppingItemUpdate {
  storeId: number;
  id: number;
  inCart: boolean;
}
@Component({
  selector: 'app-shopping-item-list',
  templateUrl: './shopping-item-list.component.html',
  styleUrls: ['./shopping-item-list.component.scss']
})
export class ShoppingItemListComponent implements OnInit, OnChanges {

  constructor() {
    this.shoppingItemsLoading = false;
    this.error = null;
    // this.shoppingList = null;
  }

  @Output()
  notifyShoppingListAvailable: EventEmitter<ShoppingList> = new EventEmitter();

  @Output()
  notifySaveShoppingItemRequested: EventEmitter<StoreShoppingItemUpdate> = new EventEmitter();

  @Output()
  notifyChangeShoppingItemLocationRequested: EventEmitter<EditItemLocationRequest> = new EventEmitter();

  @Input()
  shoppingItems: ShoppingItem[];

  @Input()
  filter: string;

  @Output()
  notifyAddNewPantryItemToStoreShoppingList: EventEmitter<CreateShoppingItemRequest> = new EventEmitter<CreateShoppingItemRequest>();

  @Output()
  notifyCancelAddItem: EventEmitter<GroceryStoreLocation> = new EventEmitter<GroceryStoreLocation>();

  @Output()
  notifyDoneAddingItem: EventEmitter<CreateShoppingItemRequest> = new EventEmitter<CreateShoppingItemRequest>();

  @Input()
  addingShoppingItemInAisle: string;

  @Input()
  groceryStore: GroceryStore;

  shoppingList: ShoppingList;

  private filteredItems: ShoppingItem[];

  shoppingItemsLoading: boolean;
  error: Error;

  private filteredShoppingItems(items: ShoppingItem[]): ShoppingItem[] {
    if (!!this.filter) {
      return items.filter(item =>
           this.filterMatchesItem(item));
    }
    return items;
  }

  // private filteredAisles(aisles: AisleItems[]): AisleItems[] {
  //   if (!!this.filter) {
  //     return aisles.filter(aisle =>
  //       aisle.items.some(item => this.filterMatchesItem(item)));
  //   }
  //   return aisles;
  // }
  //
  // private filteredSections(sections: SectionItems[]): SectionItems[] {
  //   if (!!this.filter) {
  //     return sections.filter(section =>
  //       section.items.some(item => this.filterMatchesItem(item)));
  //   }
  //   return sections;
  // }

  private filterMatchesItem(item: ShoppingItem): boolean {
    const lowerCaseFilter = this.filter.toLowerCase();
    return item.name?.toLowerCase().includes(lowerCaseFilter) ||
      item.description?.toLowerCase().includes(lowerCaseFilter);
  }

  ngOnInit() {
  //   this.getSortedShoppingItems();
  }

  onSaveShoppingItem(shoppingItem: ShoppingItem) {
    this.notifySaveShoppingItemRequested.emit({storeId: shoppingItem.storeId, id: shoppingItem.pantryItemId, inCart: shoppingItem.inCart});
  }

  onChangeShoppingItemLocation($event: EditItemLocationRequest) {
   this.notifyChangeShoppingItemLocationRequested.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('in shopping-item-list-component.ngOnChanges()');
    console.log(changes);
    console.log(`shoppingItems exist: ${!!this.shoppingItems}`);
    if ((changes.shoppingItems || changes.filter) && !!this.shoppingItems) {
      console.log('calling this.buildShoppingList()');
      this.shoppingList = this.buildShoppingList();
      this.notifyShoppingListAvailable.emit(this.shoppingList);
    }
    if (changes.addingShoppingItemInAisle) {

    }
  }


  buildShoppingList(): ShoppingList {
    console.log('calling buildShoppingList with items:');
    console.log(this.filteredShoppingItems(this.shoppingItems));
    return buildShoppingList(this.filteredShoppingItems(this.shoppingItems));
  }

  editLocation(shoppingItem: ShoppingItem) {
    this.notifyChangeShoppingItemLocationRequested.emit({
      pantryItemId: shoppingItem.pantryItemId,
      storeLocation: {
        id: shoppingItem.location.locationId,
        storeId: shoppingItem.storeId,
        storeName: '',
        ...shoppingItem.location
      },
      action: UiCrudAction.Update
    });

  }

  onFinishAddingShoppingItemInAisle(newItem: CreateShoppingItemRequest) {
    this.notifyDoneAddingItem.emit(newItem);
  }

  onAddShoppingItemClickInAisle(aisle: Aisle) {
    /* todo: emit different notification to not have to include item name */
    this.notifyAddNewPantryItemToStoreShoppingList.emit({
      aisle: aisle.name,
      storeId: this.groceryStore.id,
      name: '',
      section: null
    });
  }

  // onCancelAddItem($event: GroceryStoreLocation) {
  //   this.addingShoppingItemInAisle = false;
  // }

  onCancelAddShoppingItemRequest($event: GroceryStoreLocation) {
    this.notifyCancelAddItem.emit($event);
  }

  itemsInAisle(aisle: Aisle): ShoppingItem[] {
    const result:ShoppingItem[] = [];
    aisle.sections.forEach(section => result.push(...section.shoppingItems));
    result.push(...aisle.shoppingItems);
    return result;
  }

  isLastItemInAisle(aisle: Aisle, shoppingItem: ShoppingItem): boolean {
    const list = this.itemsInAisle(aisle);
    return list[list.length - 1] === shoppingItem ;
  }

  isLastItemInSection(section: ShoppingItemGroup, shoppingItem: ShoppingItem): boolean {
    const list = section.shoppingItems;
    return list[list.length - 1] === shoppingItem ;
  }
}
