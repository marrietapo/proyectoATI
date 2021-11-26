import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsMenuComponent } from './components/tabs-menu/tabs-menu.component';

const routes: Routes = [
  {
    path: 'client/tabs',
    component: TabsMenuComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./components/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'map',
        loadChildren: () =>
          import('./components/map-screen/map-screen.module').then(
            (m) => m.MapScreenModule
          ),
      },
      {
        path: 'locals',
        loadChildren: () =>
          import('./components/locals/locals.module').then(
            (m) => m.LocalsModule
          ),
      },
      {
        path: 'bookings',
        loadChildren: () =>
          import('./components/bookings/bookings.module').then(
            (m) => m.BookingsModule
          ),
      },
      {
        path: '',
        redirectTo: '/client/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/client/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientUserRoutingModule {}
