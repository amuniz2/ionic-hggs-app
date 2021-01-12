import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShoppingItemComponent } from './edit-shopping-item.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HggsAccordionComponent} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {Store, StoreModule} from '@ngrx/store';
import {initialAppState, reducers} from '../../../../store/app.reducers';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../test-helpers/test-router';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {PantryManagementState} from '../../../pantry-management/store/pantry-management.reducers';
import {pantryAdapter} from '../../../pantry-management/store/pantry.adapter';
import {EditPantryItemDetailsComponent} from '../../../pantry-management/dumb-components/edit-pantry-item-details/edit-pantry-item-details.component';
import {PantryItemLocationsComponent} from "../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component";

describe('EditPantryItemComponent', () => {
  let component: EditShoppingItemComponent;
  let fixture: ComponentFixture<EditShoppingItemComponent>;
  let store: MockStore<PantryManagementState>;
  const initialState: PantryManagementState = {
    pantryItems: {
      loading: false,
      error: null,
      entities: pantryAdapter.getInitialState().entities,
      ids: pantryAdapter.getInitialState().ids,
    },
    selectedPantryItemId: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditShoppingItemComponent,
        EditPantryItemDetailsComponent,
        HggsAccordionComponent,
        PantryItemLocationsComponent,
      ],
      imports: [
        IonicModule,
        FormsModule,
        // StoreModule.forRoot(reducers, {
        //   initialState: {
        //     ...initialAppState,
        //     groceryStores: {
        //       loading: false,
        //       error: null,
        //       entities: [],
        //       ids: []
        //     },
        //     groceryItemLocations: {
        //       entities: [],
        //       ids: [],
        //       error: null,
        //       loading: false
        //     }
        //   }
        // }),
        // StoreModule.forFeature('pantryManagement', pantryReducer,
        //   { initialState }),
        RouterTestingModule.withRoutes([
          {
            path: 'pantry-items',
            component: EditShoppingItemComponent
          }]),
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        // { provide: Store, useValue: provideMockStore({initialState})}
        provideMockStore({initialState})
      ],
    })
    .compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShoppingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
