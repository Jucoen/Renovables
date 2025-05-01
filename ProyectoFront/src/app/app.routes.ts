import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { FVComponentComponent } from './views/home/fvcomponent/fvcomponent.component';
import { EolicaComponent } from './views/home/eolica/eolica.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './services/auth.guard'; // Ruta correcta según tu estructura
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'fotovoltaica', component: FVComponentComponent, canActivate: [AuthGuard] },
  { path: 'eolica', component: EolicaComponent, canActivate: [AuthGuard] },
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];