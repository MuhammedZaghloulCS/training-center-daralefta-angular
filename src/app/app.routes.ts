import { Routes } from '@angular/router';
import { RoomsComponent } from './Features/Rooms/Rooms.component';
import { NotFound } from './Features/NotFound/NotFound.component';
import { CoursesComponent } from './Features/Courses/Courses.component';
import { SessionsComponent } from './Features/Sessions/Sessions.component';

export const routes: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  { path: 'rooms', component: RoomsComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'sessions', component: SessionsComponent },

  { path: '**', component: NotFound },
];
