import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePageComponent {
  public manageStoresLabel = 'Stores';
  public managePantryItemsLabel = 'Pantry Items';
  public shoppingLabel = 'Shopping'

  public constructor() {
  }

  ngOnInit() {


  }
  
  handleReceivedFile(event: Event): void {
    console.log("Received:");
    console.log(event);
  }
}
