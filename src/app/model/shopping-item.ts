export class ShoppingItem {
  storeId: number;
  pantryItemId: number;
  name: string;
  description: string;
  quantity: number;
  inCart: boolean;
  units: string;
  location: {
    locationId: number,
    aisle: string;
    section: string;
  };
}
