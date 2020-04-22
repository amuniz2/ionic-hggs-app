import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryInventoryManagerComponent } from './pantry-inventory-manager.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PantryItemListComponent} from '../../dumb-components/pantry-item-list/pantry-item-list.component';
import {SelectGroceryStoreComponent} from '../../../shared-module/dumb-components/select-grocery-store/select-grocery-store.component';
import {AddPantryItemComponent} from '../../dumb-components/add-pantry-item/add-pantry-item.component';
import {StoreModule} from '@ngrx/store';
import {initialPantryManagementState, pantryReducer} from '../../store/pantry-management.reducers';
import {reducers} from '../../../../store/app.reducers';
import {RouterTestingModule} from '@angular/router/testing';

describe('PantryInventoryManagerComponent', () => {
  let component: PantryInventoryManagerComponent;
  let fixture: ComponentFixture<PantryInventoryManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PantryInventoryManagerComponent,
        PantryItemListComponent,
        SelectGroceryStoreComponent,
        AddPantryItemComponent,
      ],
      imports: [
        IonicModule,
        FormsModule,
        // StoreModule.forFeature('pantryManagement', pantryReducer,
        //   { initialState: initialPantryManagementState }),
        StoreModule.forRoot(reducers, {
        }),
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantryInventoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
