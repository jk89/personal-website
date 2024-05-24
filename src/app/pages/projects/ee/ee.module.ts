import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EePageRoutingModule } from './ee-routing.module';
import { EePage } from './ee.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EePageRoutingModule,
    SharedDirectivesModule,
    ComponentsModule,
  ],
  declarations: [EePage]
})
export class EePageModule {}
