export class ShoppingItem {
  pantryItemId: number;
  name: string;
  description: string;
  quantity: number;
  inCart: boolean;
  units: string;
  location: {
    aisle: string;
    section: string;
  };
}
