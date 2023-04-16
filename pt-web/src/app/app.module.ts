import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClientModule} from '@angular/common/http';
import {LayoutModule} from '@angular/cdk/layout';
import {NgxFilesizeModule} from 'ngx-filesize';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {VarDirective} from './ng-var.directive';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {LoginComponent} from './login/login.component';
import {ResourcesComponent} from './resources/resources.component';
import {RegisterComponent} from './register/register.component';
import {NgParticlesModule} from 'ng-particles';
import {PasswordAgainDirective} from './password-again.directive';
import {HelpComponent} from './help/help.component';
import {PublishComponent} from './publish/publish.component';
import {InvitationComponent} from './invitation/invitation.component';
import {JwtModule} from '@auth0/angular-jwt';
import {SettingsComponent} from './setting/settings.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {ApiModule} from './api/api.module';
import {BrowseRemoteComponent} from './browse-remote/browse-remote.component';
import {MatRadioModule} from '@angular/material/radio';
import {RssComponent} from './rss/rss.component';
import {TestConnectionComponent} from './test-connection/test-connection.component';

@NgModule({
  declarations: [
    AppComponent,
    VarDirective,
    LoginComponent,
    ResourcesComponent,
    RegisterComponent,
    PasswordAgainDirective,
    HelpComponent,
    PublishComponent,
    InvitationComponent,
    SettingsComponent,
    BrowseRemoteComponent,
    RssComponent,
    TestConnectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    LayoutModule,
    MatSidenavModule,
    MatButtonToggleModule,
    NgxFilesizeModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    NgParticlesModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token'),
        allowedDomains: ['localhost', 'frogeater.vip', 'pt.lolo.moe'], //80端口和443端口不写 :80/443
      },
    }),
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    ApiModule.forRoot({rootUrl: 'http://10.198.11.148:3000/api'}),
    MatRadioModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
