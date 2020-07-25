import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/app.state';

@Component({
  selector: 'app-add-grocery-store-modal',
  templateUrl: './add-grocery-store-modal.component.html',
  styleUrls: ['./add-grocery-store-modal.component.scss']
})
export class AddGroceryStoreModalComponent implements OnInit {
  newGroceryStoreName: string;
  componentDesc: string;


  constructor(public modalController: ModalController) { }

  ngOnInit(): void {
  }

  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: AddGroceryStoreModalComponent,
  //     cssClass: 'add-grocery-store-modal'
  //   });
  //   return await modal.present();
  // }

  async dismiss(cancelled: boolean) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    await this.modalController.dismiss({
      cancelled,
      storeName: cancelled ? '' : this.newGroceryStoreName
    });
  }

  async onCancel() {
    await this.dismiss(true);
  }

  async onDone() {
    await this.dismiss(false);
  }
}
