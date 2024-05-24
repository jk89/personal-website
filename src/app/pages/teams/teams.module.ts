import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TeamsPageRoutingModule } from './teams-routing.module';
import { TeamsPage } from './teams.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamsPageRoutingModule,
    SharedDirectivesModule,
    ComponentsModule,
  ],
  declarations: [TeamsPage]
})
export class TeamsPageModule {}
