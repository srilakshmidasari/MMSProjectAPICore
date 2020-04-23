// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, ChangeDetectorRef, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, NavigationStart } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';

import { AlertService, AlertCommand, AlertMessage, MessageSeverity } from './services/alert.service';
import { NotificationService } from './services/notification.service';
import { AppTranslationService } from './services/app-translation.service';
import { AccountService } from './services/account.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { AppTitleService } from './services/app-title.service';
import { AuthService } from './services/auth.service';
import { ConfigurationService } from './services/configuration.service';
import { Permission } from './models/permission.model';
import { LoginDialogComponent } from './components/login/login-dialog.component';
import { AppDialogComponent } from './shared/app-dialog/app-dialog.component';
import { LanguagePreference } from './settings/user-preferences/user-preferences.component';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('admin', { static: false }) adminExpander: MatExpansionPanel;

  private _mobileQueryListener: () => void;
  isAppLoaded: boolean;
  isUserLoggedIn: boolean;
  isAdminExpanded = false;
  removePrebootScreen: boolean;
  newNotificationCount = 0;
  appTitle = 'Caliber Maintenance Management System';
  appLogo = require('./assets/images/logo-white.png');

  mobileQuery: MediaQueryList;
  stickyToasties: number[] = [];
  language: string = 'English';
  dataLoadingConsecutiveFailures = 0;
  notificationsLoadingSubscription: any;

  gT = (key: string | Array<string>, interpolateParams?: Object) => this.translationService.getTranslation(key, interpolateParams);
  textDir: string;

  get notificationsTitle() {
    if (this.newNotificationCount) {
      return `${this.gT('app.Notifications')} (${this.newNotificationCount} ${this.gT('app.New')})`;
    } else {
      return this.gT('app.Notifications');
    }
  }

  constructor(
    storageManager: LocalStoreManager,
    private translate: TranslateService,
    private toastaService: ToastaService,
    private toastaConfig: ToastaConfig,
    private accountService: AccountService,
    private alertService: AlertService,
    private notificationService: NotificationService,
    private appTitleService: AppTitleService,
    private authService: AuthService,
    private translationService: AppTranslationService,
    public configurations: ConfigurationService,
    public router: Router,
    public dialog: MatDialog,
    private renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    storageManager.initialiseStorageSyncListener();

    this.toastaConfig.theme = 'material';
    this.toastaConfig.position = 'top-right';
    this.toastaConfig.limit = 100;
    this.toastaConfig.showClose = true;
    this.toastaConfig.showDuration = false;

    this.appTitleService.appName = this.appTitle;


    //  language translate settings
    this.translate.setDefaultLang('en');
    var lang = localStorage.getItem('language');
    if (lang != undefined) {
      if (lang == 'en') {
        this.textDir = 'ltr';
        this.translate.use(lang);
       localStorage.setItem('language', lang);

        this.renderer.removeClass(document.body, 'dir-rtl');
        document.body.setAttribute('dir', 'ltr');
      } else {
        this.textDir = 'rtl';
        this.translate.use(lang);
        this.renderer.addClass(document.body, 'dir-rtl');
        document.body.setAttribute('dir', 'rtl');
       localStorage.setItem('language', lang);
      }
    }
    else {
      localStorage.setItem('textdir', 'ltr')
      var lang ='en'
      localStorage.setItem('language', lang);

    }

  }

  // changeLang(language: string, changeView: boolean) {
  //   if (changeView) {
  //     this.renderer.addClass(document.body, 'toggle-rtl');
  //     this.isArabic = true;
  //   } else {
  //     this.renderer.removeClass(document.body, 'toggle-ltr');
  //     this.isArabic = false;
  //   }
  //   this.translate.use(language);
  // }

  //on language change click
  changeLang(language: string) {
    debugger
    if (language == 'en') {
      this.language = 'English';
      this.renderer.removeClass(document.body, 'dir-rtl');
      document.body.setAttribute('dir', 'ltr')
     this.textDir = 'ltr';
    }
    else if (language == 'ar') {
      this.language = 'Arabic';
      this.renderer.addClass(document.body, 'dir-rtl');
      document.body.setAttribute('dir', 'rtl')
      this.textDir = 'rtl';
    }
    this.translate.use(language);
    localStorage.setItem('language', language);
    localStorage.setItem('textdir', this.textDir);
  }

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn;

    // 0.5 extra sec to display preboot/loader information. Preboot screen is removed 0.5 sec later
    setTimeout(() => this.isAppLoaded = true, 500);
    setTimeout(() => this.removePrebootScreen = true, 1000);

    setTimeout(() => {
      if (this.isUserLoggedIn) {
        this.alertService.resetStickyMessage();
        this.alertService.showMessage('Login', `Welcome back ${this.userName}!`, MessageSeverity.default);
      }
    }, 2000);

    this.alertService.getDialogEvent().subscribe(alert => this.dialog.open(AppDialogComponent,
      {
        data: alert,
        panelClass: 'mat-dialog-sm'
      }));
    this.alertService.getMessageEvent().subscribe(message => this.showToast(message));

    this.authService.reLoginDelegate = () => this.showLoginDialog();

    this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      if (this.isUserLoggedIn) {

      } else {

      }

      setTimeout(() => {
        if (!this.isUserLoggedIn) {
          this.alertService.showMessage('Session Ended!', '', MessageSeverity.default);
        }
      }, 500);
    });

    this.refreshAdminExpanderState(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.refreshAdminExpanderState((event as NavigationStart).url);
      }
    });
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }



  private refreshAdminExpanderState(currentUrl: string) {
    debugger
    setTimeout(() => {
      if (this.adminExpander && currentUrl.toLowerCase().indexOf('admin') > 0) {
        this.adminExpander.open();
      }
    }, 200);
  }

  showLoginDialog(): void {
    this.alertService.showStickyMessage('Session Expired', 'Your Session has expired. Please log in again', MessageSeverity.info);

    const dialogRef = this.dialog.open(LoginDialogComponent, { minWidth: 600 });

    dialogRef.afterClosed().subscribe(result => {
      this.alertService.resetStickyMessage();

      if (!result || this.authService.isSessionExpired) {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        this.alertService.showStickyMessage('Session Expired', 'Your Session has expired. Please log in again to renew your session', MessageSeverity.warn);
      }
    });
  }

  showToast(alert: AlertCommand) {

    if (alert.operation == 'clear') {
      for (const id of this.stickyToasties.slice(0)) {
        this.toastaService.clear(id);
      }

      return;
    }

    const toastOptions: ToastOptions = {
      title: alert.message.summary,
      msg: alert.message.detail,
    };

    if (alert.operation == 'add_sticky') {
      toastOptions.timeout = 0;

      toastOptions.onAdd = (toast: ToastData) => {
        this.stickyToasties.push(toast.id);
      };

      toastOptions.onRemove = (toast: ToastData) => {
        const index = this.stickyToasties.indexOf(toast.id, 0);

        if (index > -1) {
          this.stickyToasties.splice(index, 1);
        }

        if (alert.onRemove) {
          alert.onRemove();
        }

        toast.onAdd = null;
        toast.onRemove = null;
      };
    } else {
      toastOptions.timeout = 4000;
    }


    switch (alert.message.severity) {
      case MessageSeverity.default: this.toastaService.default(toastOptions); break;
      case MessageSeverity.info: this.toastaService.info(toastOptions); break;
      case MessageSeverity.success: this.toastaService.success(toastOptions); break;
      case MessageSeverity.error: this.toastaService.error(toastOptions); break;
      case MessageSeverity.warn: this.toastaService.warning(toastOptions); break;
      case MessageSeverity.wait: this.toastaService.wait(toastOptions); break;
    }
  }

  logout() {
    this.authService.logout();
    this.authService.redirectLogoutUser();
  }

  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : '';
  }

  get fullName(): string {
    return this.authService.currentUser ? this.authService.currentUser.fullName : '';
  }

  get canViewCustomers() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission);
  }

  get canViewProducts() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission);
  }

  get canViewOrders() {
    return true;
  }

  get canViewUsers() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canViewSites() {
    return this.accountService.userHasPermission(Permission.viewSitesPermission);
  }
  get canViewProjects() {
    return this.accountService.userHasPermission(Permission.viewProjectsPermission);
  }
  get canViewStores() {
    return this.accountService.userHasPermission(Permission.viewStoresPermission);
  }

  get canViewLocation() {
    return this.accountService.userHasPermission(Permission.viewLocationsPermission);
  }

  get canViewAssets() {
    return this.accountService.userHasPermission(Permission.viewAssetsPermission);
  }

  get canViewAssetGroup() {
    return this.accountService.userHasPermission(Permission.viewAssetGroupsPermission);
  }
}
