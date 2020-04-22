import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryItemListComponent } from './pantry-item-list.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {initialAppState, reducers} from '../../../../store/app.reducers';

describe('PantryItemListComponent', () => {
  let component: PantryItemListComponent;
  let fixture: ComponentFixture<PantryItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantryItemListComponent ],
      imports: [
        IonicModule,
        FormsModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers, { initialState: initialAppState })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantryItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
