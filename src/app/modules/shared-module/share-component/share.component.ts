import {Component, OnInit, Output} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-share-component',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  selectedOption: string;

  constructor(/*private events: Events, */private popoverController: PopoverController) { }

  ngOnInit(): void {
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ShareComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  emailOptionClicked($event: CustomEvent) {

  }

  messageOptionClicked($event: CustomEvent) {

  }

  onSelectSharingTarget($event: CustomEvent) {
    this.selectedOption = $event.detail.value;
    // this.aisleOrSectionChange.emit({ name: $event.detail.value});
  }

  sendViaEmail() {
    // this.events.publish('event data');
    this.popoverController.dismiss();
  }

  sendViaMessaging() {
    this.popoverController.dismiss();
  }
}
