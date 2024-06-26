import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent // Declare your AppComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    HomeComponent
  ],
})
export class AppModule { }
