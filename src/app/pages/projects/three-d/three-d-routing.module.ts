import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThreeDPage } from './three-d.page';

const routes: Routes = [
  {
    path: '',
    component: ThreeDPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThreeDPageRoutingModule {}
