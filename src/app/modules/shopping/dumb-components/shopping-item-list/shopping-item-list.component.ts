import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ShoppingItem} from '../../../../model/shopping-item';
import {
  EditItemLocationRequest
} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';
import {UiCrudAction} from '../../../../ui-crud-actions';
import {CreateShoppingItemForNewPantryItem, CreateShoppingItemRequest} from '../../store/shopping.actions';
import {GroceryStore} from '../../../../model/grocery-store';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';

export interface AddPantryItemToStoreShoppingList {
  aisle: Aisle;
}

class ShoppingItemGroup {
  name: string;
  shoppingItems: ShoppingItem[];
}

class Aisle extends ShoppingItemGroup {
  sections: ShoppingItemGroup[];
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
  notifySaveShoppingItemRequested: EventEmitter<StoreShoppingItemUpdate> = new EventEmitter();

  @Output()
  notifyChangeShoppingItemLocationRequested: EventEmitter<EditItemLocationRequest> = new EventEmitter();

  @Input()
  shoppingList: ShoppingItem[];

  @Input()
  filter: string;

  @Output()
  notifyAddNewPantryItemToStoreShoppingList: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  addingShoppingItemInAisle: boolean;

  @Input()
  groceryStore: GroceryStore;

  aisles: Aisle[];
  sections: ShoppingItemGroup[];
  itemsWithNoStoreLocation: ShoppingItem[];

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
    console.log('emitting', {storeId: shoppingItem.storeId, id: shoppingItem.pantryItemId, inCart: shoppingItem.inCart});
    this.notifySaveShoppingItemRequested.emit({storeId: shoppingItem.storeId, id: shoppingItem.pantryItemId, inCart: shoppingItem.inCart});
  }

  onChangeShoppingItemLocation($event: EditItemLocationRequest) {
   this.notifyChangeShoppingItemLocationRequested.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.shoppingList || changes.filter) && this.shoppingList) {
      this.buildShoppingList();
    }
  }

  private buildAisle(groupName: string, itemsInGroup: ShoppingItem[]): Aisle {
    /// const itemsInAisle = filteredAisleItems.filter(item => item.location.aisle === aisle);
    const itemsInSectionWithinAisle = [];
    const itemsInAisleWithNoSection = [];

    itemsInGroup.forEach(item => {
      if (!!item.location.section) {
        itemsInSectionWithinAisle.push(item);
      } else {
        itemsInAisleWithNoSection.push(item);
      }
    });

    const newAisle = {
      name: groupName,
      sections: [],
      shoppingItems: itemsInAisleWithNoSection
    };

    const distinctSectionsInAisle = new Set(itemsInSectionWithinAisle.map(item => item.location.section));
    distinctSectionsInAisle.forEach(section => {
      newAisle.sections.push({
        name: section,
        shoppingItems: itemsInGroup.filter(item => item.location.section === section)
      });
    });
    return newAisle;
  }

  buildShoppingList() {
    this.aisles = [];
    this.sections = [];

    this.filteredItems = this.filteredShoppingItems(this.shoppingList);
    console.log('filtered items', this.filteredItems);
    const filteredAisleItems = this.filteredItems.filter(item => !!item.location?.aisle);

    const distinctAisles: Set<string> = new Set(filteredAisleItems.map(x => x.location.aisle));
    const filteredSectionItems = this.filteredItems.filter((item) => !distinctAisles.has(item.location?.aisle) && !!item.location?.section);

    distinctAisles.forEach(aisle =>
      this.aisles.push(this.buildAisle(aisle, filteredAisleItems.filter(item => item.location.aisle === aisle))));

    const distinctSections: Set<string> = new Set(filteredSectionItems.map(x => x.location.section));

    distinctSections.forEach(section => this.sections.push({
      name: section,
      shoppingItems: filteredSectionItems.filter(item => item.location.section === section)
    }));

    this.itemsWithNoStoreLocation = this.filteredItems.filter(item =>
      !item.location ||
      (!item.location || (!distinctAisles.has(item.location.aisle) && !distinctSections.has(item.location.section))));
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

  onAddShoppingItemClickInAisle(aisleName: string) {
    this.notifyAddNewPantryItemToStoreShoppingList.emit(aisleName)
  }
}
