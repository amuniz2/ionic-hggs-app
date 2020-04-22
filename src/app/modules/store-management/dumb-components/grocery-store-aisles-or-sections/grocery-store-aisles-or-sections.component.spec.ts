import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreAislesOrSectionsComponent } from './grocery-store-aisles-or-sections.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import * as fromReducers from '../../store/store-management.reducers';
import {reducers} from '../../../../store/app.reducers';
import {RouterTestingModule} from '@angular/router/testing';

describe('GroceryStoreAislesOrSectionsComponent', () => {
  let component: GroceryStoreAislesOrSectionsComponent;
  let fixture: ComponentFixture<GroceryStoreAislesOrSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreAislesOrSectionsComponent ],
      imports: [
        FormsModule,
        IonicModule,
        StoreModule.forRoot(reducers, {
        }),
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreAislesOrSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
