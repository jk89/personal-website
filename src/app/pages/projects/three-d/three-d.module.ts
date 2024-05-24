import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ThreeDPageRoutingModule } from './three-d-routing.module';
import { ThreeDPage } from './three-d.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThreeDPageRoutingModule,
    SharedDirectivesModule,
    ComponentsModule,
  ],
  declarations: [ThreeDPage]
})
export class ThreeDPageModule {}
