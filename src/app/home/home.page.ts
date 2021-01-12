import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePageComponent {
  public manageStoresLabel = 'Stores';
  public managePantryItemsLabel = 'Pantry Items';

  public constructor() {
  }
}
