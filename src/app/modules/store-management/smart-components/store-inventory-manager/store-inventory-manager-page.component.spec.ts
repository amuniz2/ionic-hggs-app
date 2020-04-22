import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInventoryManagerPageComponent } from './store-inventory-manager-page.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {StoreListComponent} from '../../dumb-components/store-list/store-list.component';
import {AddGroceryStoreComponent} from '../../dumb-components/add-grocery-store/add-grocery-store';
import {EditGroceryStoreComponent} from '../../dumb-components/edit-grocery-store/edit-grocery-store.component';
import {GroceryStoreAislesOrSectionsComponent} from '../../dumb-components/grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {HggsAccordionComponent} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../../store/app.reducers';
import {RouterTestingModule} from '@angular/router/testing';

describe('StoreInventoryManagerPageComponent', () => {
  let component: StoreInventoryManagerPageComponent;
  let fixture: ComponentFixture<StoreInventoryManagerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StoreInventoryManagerPageComponent,
        StoreListComponent,
        AddGroceryStoreComponent,
        EditGroceryStoreComponent,
        GroceryStoreAislesOrSectionsComponent,
        HggsAccordionComponent,
      ],
      imports: [
        IonicModule,
        FormsModule,
        StoreModule.forRoot(reducers, {
        }),
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreInventoryManagerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
