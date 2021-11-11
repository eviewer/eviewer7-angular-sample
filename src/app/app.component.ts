import { Component } from '@angular/core';
import { IntegrationService } from './integration/integration.service';
import { eViewerApp } from '@mstechusa/eviewer7-cli';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'eviewer-lib-application';
  subscription: any;
  isViewerLoad: boolean = false;
  constructor(
    private integrationService: IntegrationService,
    private eViewer_App: eViewerApp
  ) {
    this.subscription = this.eViewer_App.isViewerLoaded.subscribe((value) => {
      this.isViewerLoad = value;
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
