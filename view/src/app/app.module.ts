// Start of default Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { DeleteConfirmation } from './components/main/delete-confirmation.component';
// End of Default Angular imports

// Manually added this Angular import - for routing.
import { RouterModule, Routes } from '@angular/router';

// Manually added for making HTTP requests
import { HttpClientModule } from '@angular/common/http';

import { GuardService } from './guard/guard.service';

// Manually added this Angular import which is used in app.component.html
// import { MatToolbarModule } from '@angular/material';
// MOVED THIS CODE TO MATERIAL.MODULE.TS

// Manually added for login page.
import { CustomMaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';

// Imports for Main Page
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule, MatTableModule, } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

// Manually added HTTP provider
import { LoginService } from './services/login.service';

/**
 * Manually added
 * Added the routing configuration as an array of Routes.
 * Uses the factory method RouterModule.forRoot to hand over our routing config.
 * Connects a URL extension (like 'login') to a component (LoginComponent).
 */
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent, canActivate: [GuardService]},
  //{ path: '', redirectTo: '/login', pathMatch: 'full' }, // Display Login first when navigating to root
  { path: '**', redirectTo : '/login' }



  
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    DeleteConfirmation,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatToolbarModule,
    MatDialogModule,

    /**
     * Manually added
     * To activate the routing configuration for the Angular app.
     */
    RouterModule.forRoot(
      appRoutes,
      //{ enableTracing: true } // <-- debugging purposes only
    ),

    // Manually added - used in app.component.html
    // MatToolbarModule,

    // For login page
    CustomMaterialModule,
    FormsModule,

    // For login service
    HttpClientModule,
  ],
  // For Delete Confirmation on Main Page
  entryComponents: [DeleteConfirmation],

  providers: [LoginService],
  bootstrap: [AppComponent],

})
export class AppModule { }
