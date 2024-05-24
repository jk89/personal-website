import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WebDevPageRoutingModule } from './web-dev-routing.module';
import { WebDevPage } from './web-dev.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebDevPageRoutingModule,
    SharedDirectivesModule,
    ComponentsModule,
  ],
  declarations: [WebDevPage]
})
export class WebDevPageModule {}
