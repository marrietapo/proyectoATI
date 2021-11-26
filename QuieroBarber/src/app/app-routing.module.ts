import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthBarberGuard } from './guards/auth-barber.guard';
import { AuthClientGuard } from './guards/auth-client.guard';

const routes: Routes = [
  { path: '', redirectTo:'/login', pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'client',
    canLoad: [AuthClientGuard],
    loadChildren: () =>
    import('./modules/client-user/client-user.module').then((m) => m.ClientUserModule),
  },
  {
    path: 'barber',
    canLoad: [AuthBarberGuard],
    loadChildren: () =>
    import('./modules/barber-user/barber-user.module').then((m) => m.BarberUserModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
