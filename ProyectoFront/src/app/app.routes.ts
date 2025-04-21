import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { FVComponentComponent } from './views/home/fvcomponent/fvcomponent.component';
import { EolicaComponent } from './views/home/eolica/eolica.component';


export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'fotovoltaica', component: FVComponentComponent},
  {path: 'eolica', component: EolicaComponent},

  {path: '', redirectTo: 'home', pathMatch:'full'}

];
