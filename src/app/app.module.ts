import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { AboutDoubtfireModal, AboutDoubtfireModalContent } from 'src/app/common/modals/about-doubtfire-modal/about-doubtfire-modal.component'
import { DoubtfireConstants } from 'src/app/config/constants/constants'

import { setTheme } from 'ngx-bootstrap/utils';

@NgModule({
  declarations: [
    AboutDoubtfireModalContent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UpgradeModule,
    ModalModule.forRoot()
  ],
  providers: [AboutDoubtfireModal],
  entryComponents: [AboutDoubtfireModalContent]
})
export class AppModule {
  constructor(
    private upgrade: UpgradeModule,
    private constants: DoubtfireConstants,
    private title: Title) {

    setTheme('bs3'); // or 'bs4'

    this.constants.loadExternalName.then(res => {
      this.title.setTitle(res.externalName);
    })
  }

  ngDoBootstrap() {
    this.upgrade.bootstrap(document.body, ['doubtfire'], { strictDi: false });
  }
}
