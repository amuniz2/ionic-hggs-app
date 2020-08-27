import {isNumeric} from 'rxjs/internal-compatibility';

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
