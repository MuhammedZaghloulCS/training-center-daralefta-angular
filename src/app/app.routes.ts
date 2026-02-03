import { Routes } from '@angular/router';
import { RoomsComponent } from './Features/Rooms/Rooms.component';
import { BuildingsComponent } from './Features/Buildings/Buildings.component';
import { TrainingsComponent } from './Features/Trainings/Trainings.component';
import { SurveysComponent } from './Features/Surveys/Surveys.component';
import { NotFound } from './Features/NotFound/NotFound.component';
import { CoursesComponent } from './Features/Courses/Courses.component';
import { SessionsComponent } from './Features/Sessions/Sessions.component';

export const routes: Routes = [
  { path: '', redirectTo: 'surveys', pathMatch: 'full' },
  { path: 'rooms', component: RoomsComponent },
  { path: 'buildings', component: BuildingsComponent },
    { path: 'trainings/:trainingId', component: TrainingsComponent },
  { path: 'trainings', component: TrainingsComponent },
  { path: 'surveys', component: SurveysComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'sessions', component: SessionsComponent },

  { path: '**', component: NotFound },
];
