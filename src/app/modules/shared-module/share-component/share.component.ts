import {Component, OnInit} from '@angular/core';
import {PopoverController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SocialSharing} from '@ionic-native/social-sharing/ngx'
import {options} from 'ionicons/icons';

@Component({
  selector: 'app-share-component',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  selectedOption: string;
  promptForEmail: boolean;
  emailAddress: string;
  emailForm: FormGroup;

  constructor(/*private events: Events, */private popoverController: PopoverController,
              private fb: FormBuilder,
              private socialSharing: SocialSharing,
              private toastController: ToastController) {
    this.emailForm = this.fb.group({
      ['emailAddress']: this.emailAddress,
    })
  }

  ngOnInit(): void {
  }

  emailOptionClicked($event: CustomEvent) {
    this.promptForEmail = true;
  }

  messageOptionClicked($event: CustomEvent) {

  }

  onSelectSharingTarget($event: CustomEvent) {
    this.selectedOption = $event.detail.value;
    // this.aisleOrSectionChange.emit({ name: $event.detail.value});
  }

  getEmailInformation() {
    // this.events.publish('event data');
    this.promptForEmail = true;
  }

  async sendViaEmail() {
    // this.events.publish('event data');
    const onSuccess = async function(result) {
      const toast = await this.toastController.create({message: 'Email sent.', duration: 200});
      await toast.present();
    };

    const onError = async function(err) {
      const toast = await this.toastController.create({message: `Email failed to send with error: ${JSON.stringify(err)}.`, duration: 5000});
      await toast.present();
    };

    await this.socialSharing.shareWithOptions({
      subject: 'Grocery shopping list',
      message: 'Grocery Shopping List (subject)'
    }).then(async r => await onSuccess(r)).catch(async err => await onError(err));

    // this.socialSharing.canShareViaEmail().then((canSend) => {
    //     if (canSend) {
    //       this.socialSharing.shareViaEmail('Grocery shopping list', 'Grocery Shopping List (subject)', [this.emailAddress]).then(async r => {
    //         const toast = await this.toastController.create({message: 'Email sent.', duration: 200});
    //         await toast.present();
    //       });
    //       return true;
    //     } else {
    //       console.log('Cannot send via email');
    //       return false
    //     }
    //   });
    // console.log('send and dismiss');
    await this.popoverController.dismiss();
  }

  sendViaMessaging() {
    this.popoverController.dismiss();
  }
}
