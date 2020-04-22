import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreListComponent } from './store-list.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../../store/app.reducers';

describe('StoreListComponent', () => {
  let component: StoreListComponent;
  let fixture: ComponentFixture<StoreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreListComponent ],
      imports: [
        IonicModule,
        FormsModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers, {
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
