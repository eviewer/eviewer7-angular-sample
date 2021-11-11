import { BrowserModule } from '@angular/platform-browser';
import * as $ from 'jquery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EviewerLibModule } from '@mstechusa/eviewer7-cli';
import { CommonModule } from '@angular/common';
import { IntegrationComponent } from './integration/integration.component';
import { IntegrationService } from './integration/integration.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppComponent, IntegrationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EviewerLibModule,
    FormsModule,
    RouterModule,
  ],
  providers: [IntegrationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
