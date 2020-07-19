import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-add-grocery-store-modal',
  templateUrl: './add-grocery-store-modal.component.html',
  styleUrls: ['./add-grocery-store-modal.component.scss']
})
export class AddGroceryStoreModalComponent implements OnInit {
  newGroceryStoreName: any;

  constructor(public modalController: ModalController,) { }

  ngOnInit(): void {
  }

  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: AddGroceryStoreModalComponent,
  //     cssClass: 'add-grocery-store-modal'
  //   });
  //   return await modal.present();
  // }

  async dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    await this.modalController.dismiss({
      dismissed: true,
      storeName: this.newGroceryStoreName
    });
  }
}
