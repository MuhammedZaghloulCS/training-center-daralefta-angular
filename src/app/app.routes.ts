import { Routes } from '@angular/router';
import { RoomsComponent } from './Features/Rooms/Rooms.component';
import { NotFound } from './Features/NotFound/NotFound.component';
import { CoursesComponent } from './Features/Courses/Courses.component';

export const routes: Routes = [
  {path:'',redirectTo:'Courses',pathMatch:'full'},
    {path:'Rooms',component:RoomsComponent},
        {path:'Courses',component:CoursesComponent},

    {path:'**',component:NotFound},];
