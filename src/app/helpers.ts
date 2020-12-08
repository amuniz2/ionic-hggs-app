import {isNumeric} from 'rxjs/internal-compatibility';
import {GroceryStoreLocation} from './model/grocery-store-location';

// belongs someewhere else
export interface CreatePantryItemRequest {
  name: string;
  initialStoreLocation?: GroceryStoreLocation;
}

export function getAisleOrSectionDescription(name: string, label: string): string {
  if (name) {
    if (isNumeric(name)) {
      return  `${label} ${name}`;
    } else {
      return  `${name} ${label}`;
    }
  }
  return '';
};

export function sortAislesOrSections(name1, name2): number {
  const name1IsNumeric = isNumeric(name1);
  const name2IsNumeric = isNumeric(name2);

  if (name1IsNumeric && name2IsNumeric) {
    const name1Num = Number(name1);
    const name2Num = Number(name2);
    return name1Num < name2Num ? -1 : name1Num > name2Num ? 1 : 0;
  } else {
    if (name1IsNumeric) {
      return -1;
    } else if (name2IsNumeric) {
      return 1;
    } else {
      return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
    }
  }
}
