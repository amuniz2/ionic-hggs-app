import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppState } from './store/app.state';
import { Store } from '@ngrx/store';
import { StartAppInitializer } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  manageStoresLabel = 'Manage stores';
  constructor(
    private platform: Platform,
    private store: Store<AppState>
    // private statusBar: StatusBar
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {

      this.store.dispatch( new StartAppInitializer());
      // this.statusBar.styleDefault();

//      this.splashScreen.hide();
    });
  }
}
