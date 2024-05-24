import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SciencePageRoutingModule } from './science-routing.module';
import { SciencePage } from './science.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SciencePageRoutingModule,
    SharedDirectivesModule,
    ComponentsModule,
  ],
  declarations: [SciencePage]
})
export class SciencePageModule {}
