import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EePage } from './ee.page';

const routes: Routes = [
  {
    path: '',
    component: EePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EePageRoutingModule {}
