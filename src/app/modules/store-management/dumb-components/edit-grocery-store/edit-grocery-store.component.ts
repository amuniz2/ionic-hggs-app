import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {StoreAisleOrSection,
  StoreAisleOrSectionActionRequest} from '../grocery-store-aisles/grocery-store-aisles-or-sections.component';
import {Observable, of} from 'rxjs';
import {CollapsedStatusChangedEvent, PageSection} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {UiCrudAction} from '../../../../ui-crud-actions';
export interface AccordionSections {
  [sectioName: string]: PageSection;
}

@Component({
  selector: 'app-edit-grocery-store',
  templateUrl: './edit-grocery-store.component.html',
  styleUrls: ['./edit-grocery-store.component.scss']
})
export class EditGroceryStoreComponent implements OnInit {

  @Input()
  groceryAislesSectionIsOpen: boolean;

  private sections: AccordionSections;

  aislesSection: PageSection = {
    label: 'Aisles',
    isOpen$: of(false)
  };
  grocerySectionsSection: PageSection = {
    label: 'Grocery Sections',
    isOpen$: of(false)
  };

  addingAisle$: Observable<boolean>;
  addingSection$: Observable<boolean>;

  @Input()
  groceryStore: GroceryStore;

  @Output()
  notifyNewStoreAisleRequested: EventEmitter<StoreAisleOrSectionActionRequest> = new EventEmitter();

  @Output()
  notifyDeleteStoreAisleRequested: EventEmitter<StoreAisleOrSection> = new EventEmitter();

  @Output()
  notifyNewGroceryStoreSectionRequested: EventEmitter<StoreAisleOrSectionActionRequest> = new EventEmitter();

  @Output()
  notifyDeleteGroceryStoreSectionRequested: EventEmitter<StoreAisleOrSection> = new EventEmitter();

  @Output()
  notifyExpandAisles: EventEmitter<number> = new EventEmitter();

  @Output()
  notifyExpandSections: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onNotifyNewStoreAisleRequest($event: StoreAisleOrSectionActionRequest) {
    if ($event.action === UiCrudAction.RequestCreate) {
      this.addingAisle$ = of(true);
    } else {
      this.addingAisle$ = of(false);
      if (($event.action === UiCrudAction.Create) && $event.aisleOrSectionName) {
        this.notifyNewStoreAisleRequested.emit($event);
      }
    }
  }

  onNotifyDeleteStoreAisleRequest($event: StoreAisleOrSection) {
    this.notifyDeleteStoreAisleRequested.emit($event);
  }

  onNotifyNewStoreGrocerySectionRequest($event: StoreAisleOrSectionActionRequest) {
    if ($event.action === UiCrudAction.RequestCreate) {
      this.addingSection$ = of(true);
    } else {
      this.addingSection$ = of(false);
      if (($event.action === UiCrudAction.Create) && $event.aisleOrSectionName) {
        this.notifyNewGroceryStoreSectionRequested.emit($event);
      }
    }
  }

  onNotifyDeleteGroceryStoreSectionRequest($event: StoreAisleOrSection) {
    this.notifyDeleteGroceryStoreSectionRequested.emit($event);
  }
  public toggleAislesExpandState($event: CollapsedStatusChangedEvent) {
      this.aislesSection.isOpen$ = of($event.isOpen);
      if ($event.isOpen && this.groceryStore.aisles.length === 0) {
        this.notifyExpandAisles.emit(this.groceryStore.id);
      }
  }

  public toggleGroceryStoreSectionsExpandState($event: CollapsedStatusChangedEvent) {
    this.grocerySectionsSection.isOpen$ = of($event.isOpen);
    if ($event.isOpen && this.groceryStore.sections.length === 0) {
      this.notifyExpandSections.emit(this.groceryStore.id);
    }
  }

  onAddAisleClicked() {
    this.addingAisle$ = of(true);
  }

  onAddSectionClicked() {
    this.addingSection$ = of(true);
  }
}
