import {IPantryDataService} from '../../../../services/IPantryDataService';
import sinon from 'sinon';
import SpyObj = jasmine.SpyObj;
import {StoreManagerActionTypes, CreateStore} from '../store-management.actions';
import {Observable, of} from 'rxjs';
import {Actions} from '@ngrx/effects';
import {StoreCreated} from '../../../../store';
import {StoreManagementEffects} from './store-management.effects';
import { cold, hot } from 'jasmine-marbles';

describe('GroceryStoreManagement Effects', () => {
  let actionStream: Observable<Actions>;
  let effects: StoreManagementEffects;
  let pantryDataService: SpyObj<IPantryDataService> = sinon.stub();
  let store: any;
  let router: any;
  // let pantryDataService: Stub<IPantryDataService>;

  beforeEach(() => {
    pantryDataService = sinon.stub();
    router = sinon.stub();
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);

    describe('addNewGroceryStore Effect', () => {
      const testStore = { name: 'Test Store'};

      beforeEach(() => {
        const source = cold('-a', {
          a: new CreateStore(testStore)
        });
        effects = new StoreManagementEffects(
          store as any,
          new Actions(),
          pantryDataService,
          router);
      });

      it('should run for actions StoreManagerActionTypes.CreateStore', () => {
        sinon.stub(pantryDataService, 'addGroceryStore').returns({});
        actionStream = hot('-a', {
          a: { type: StoreManagerActionTypes.CreateStore }
        });
        const expectedAction = new StoreCreated({
          ...testStore,
          aisles: [],
          sections: [],
          id: 1,
          locations: [],
        });
        const expectedStream = cold('--a', {
          a: expectedAction
        });

        expect(effects.addNewGroceryStore$).toBeObservable(expectedStream);
      });
    });
   });
});
