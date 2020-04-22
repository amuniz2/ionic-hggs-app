import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelectedGroceryStoreComponent } from './edit-selected-grocery-store.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {EditGroceryStoreComponent} from '../../dumb-components/edit-grocery-store/edit-grocery-store.component';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../../store/app.reducers';
import {RouterTestingModule} from '@angular/router/testing';
import {Router, RouterModule} from '@angular/router';
import {RouterStub} from '../../../../test-helpers/test-router';
import {routes} from '../../../../app-routing.module';
import {HomePageComponent} from '../../../../home/home.page';

describe('EditSelectedGroceryStoreComponent', () => {
  let component: EditSelectedGroceryStoreComponent;
  let fixture: ComponentFixture<EditSelectedGroceryStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditSelectedGroceryStoreComponent,
        HomePageComponent,
        EditGroceryStoreComponent,
      ],
      imports: [
        IonicModule,
        FormsModule,
        StoreModule.forRoot(reducers, {
        }),
        // RouterModule,
        RouterTestingModule.withRoutes(routes)
      ],
      //     .withRoutes([
      //     {path: '', component: EditSelectedGroceryStoreComponent},
      //     {path: 'simple', component: EditGroceryStoreComponent}]),
      // ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ {provide: Router, useClass: RouterStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSelectedGroceryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
