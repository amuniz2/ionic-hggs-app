// import {IPantryDataService} from './IPantryDataService';
// import {HggsData} from '../model/hggs-data';
// import {map} from 'rxjs/operators';
// import {GroceryStore} from '../model/grocery-store';
//
// export interface IGroceryDataExporter {
//   exportAll(): HggsData;
// }
//
// export class GroceryDataExporter implements IGroceryDataExporter {
//   constructor(private pantryDataService: IPantryDataService) {}
//
//   exportAll(): HggsData {
//     const groceryStores = this.pantryDataService.getGroceryStores();
//     groceryStores.subscribe()
//
//     return {
//       groceryStores
//     };
//   }
//
//   exportGroceryStoreLocations(groceryStore: GroceryStore) {
//     const locations = this.pantryDataService.getGroceryStoreLocations(groceryStore.id);
//
//     locations.pipe(
//       map( (locationList) => {
//         locationList.forEach(location => {
//           location.
//         });
//       })
//     );
//   }
// }
