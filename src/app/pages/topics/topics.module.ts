import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopicsPageRoutingModule } from './topics-routing.module';

import { TopicsPage } from './topics.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopicsPageRoutingModule,
    SharedDirectivesModule,
    ComponentsModule,
  ],
  declarations: [TopicsPage]
})
export class TopicsPageModule {}
