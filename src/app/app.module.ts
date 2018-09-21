import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './components/app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiModule } from './components/ui/ui.module';
import { EnrollmentModule } from './components/enrollment/enrollment.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UiModule,
    EnrollmentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
