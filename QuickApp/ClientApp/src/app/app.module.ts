// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { ToastaModule } from 'ngx-toasta';
import { ChartsModule } from 'ng2-charts';
import { NguCarouselModule } from '@ngu/carousel';

import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';

import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
import { FooterModule } from './shared/footer/footer.component';
import { ThemePickerModule } from './shared/theme-picker/theme-picker.component';

import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { AuthStorage } from './services/auth-storage';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LoginControlComponent } from './components/login/login-control.component';
import { LoginDialogComponent } from './components/login/login-dialog.component';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';





@NgModule({
  imports: [
    SharedModule,
    FooterModule,
    ThemePickerModule,
    HttpClientModule,
    AdminModule,
    SettingsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    }),
    OAuthModule.forRoot(),
    ToastaModule.forRoot(),
    LeafletModule.forRoot(),
    ChartsModule,
    NguCarouselModule
  ],
  declarations: [
    AppComponent,
    LoginComponent, LoginControlComponent, LoginDialogComponent,
    RegisterComponent,
    ConfirmEmailComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    AboutComponent,
    NotFoundComponent,
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: OAuthStorage, useClass: AuthStorage },
    AlertService,
    ConfigurationService,
    AppTitleService,
    AppTranslationService,
    NotificationService,
    NotificationEndpoint,
    AccountService,
    AccountEndpoint,
    LocalStoreManager
  ],
  entryComponents: [
    LoginDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
