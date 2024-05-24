import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// add this pathMatch: 'full'
// add 404 page

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'teams',
    loadChildren: () => import('./pages/teams/teams.module').then( m => m.TeamsPageModule),
  },
  {
    path: 'teams/:id',
    loadChildren: () => import('./pages/teams/teams.module').then( m => m.TeamsPageModule)
  },
  {
    path: 'topics',
    loadChildren: () => import('./pages/topics/topics.module').then( m => m.TopicsPageModule)
  },
  {
    path: 'topics/:id',
    loadChildren: () => import('./pages/topics/topics.module').then( m => m.TopicsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home/:id',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'projects/ee',
    loadChildren: () => import('./pages/projects/ee/ee.module').then( m => m.EePageModule)
  },
  {
    path: 'projects/ee/:id',
    loadChildren: () => import('./pages/projects/ee/ee.module').then( m => m.EePageModule)
  },
  {
    path: 'projects/web-dev',
    loadChildren: () => import('./pages/projects/web-dev/web-dev.module').then( m => m.WebDevPageModule)
  },
  {
    path: 'projects/web-dev/:id',
    loadChildren: () => import('./pages/projects/web-dev/web-dev.module').then( m => m.WebDevPageModule)
  },
  {
    path: 'projects/3d',
    loadChildren: () => import('./pages/projects/three-d/three-d.module').then( m => m.ThreeDPageModule)
  },
  {
    path: 'projects/3d/:id',
    loadChildren: () => import('./pages/projects/three-d/three-d.module').then( m => m.ThreeDPageModule)
  },
  {
    path: 'projects/science',
    loadChildren: () => import('./pages/projects/science/science.module').then( m => m.SciencePageModule)
  },
  {
    path: 'projects/science/:id',
    loadChildren: () => import('./pages/projects/science/science.module').then( m => m.SciencePageModule)
  },
  {
    path: "**",
    redirectTo: "home"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
