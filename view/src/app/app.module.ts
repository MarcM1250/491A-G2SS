// Default Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';

// Manually added this Angular import.
import { RouterModule, Routes } from '@angular/router';

  /** 
   * Manually added
   * Added the routing configuration as an array of Routes.
   * Uses the factory method RouterModule.forRoot to hand over our routing config.
   * Connects a URL extension (like 'login') to a component (LoginComponent).
   * A redirect is configured from the default app route to the route displaying content from LoginComponent.
   */

  const appRoutes: Routes = [
    { path: 'login', component: LoginComponent}, 
    { path: 'main', component: MainComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    /** 
     * Manually added
     * To activate the routing configuration for the Angular app.
     */
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
