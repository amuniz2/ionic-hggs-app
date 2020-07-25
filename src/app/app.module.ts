import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {EffectsModule} from '@ngrx/effects';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {appRootReducers} from './store/app.reducers';
import {environment} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {CommonModule} from '@angular/common';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {HomePageComponent} from './home/home.page';
import {StoreManagementModule} from './modules/store-management/store-management.module';
import {PantryDbHelper} from './services/db/db-helper';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {SharedModule} from './modules/shared-module/shared.module';
import {MySqlCommands} from './services/db/my-sql-commands';
import {FakePantryDataService} from './services/fake-pantry-data.service';
import {PantryDataService} from './services/pantry-data.service';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    StoreModule.forRoot({app: appRootReducers}),
    // StoreModule.forFeature('app', appRootReducers),
    // StoreModule.forRoot(reducers, { metaReducers, initialState: initialAppState }),
    EffectsModule.forRoot([]),
    IonicModule.forRoot({
      mode: 'md'
    }),
    SharedModule,
    StoreManagementModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    StatusBar,
    // [{provide: 'IPantryDataService', useClass: PantryDataService}],
    [{provide: 'IPantryDataService', useClass: FakePantryDataService}],
    PantryDbHelper,
    MySqlCommands,
    SQLite
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
