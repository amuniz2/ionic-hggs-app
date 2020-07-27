import {GroceryStore, GroceryStoreState} from './grocery-store';

export const groceryStoreFromGrocerStoreState = (state: GroceryStoreState): GroceryStore => {
  return {
    ...state,
    aisles: new Set<string>(state?.aisles),
    sections: new Set(state?.sections),
  };
};
