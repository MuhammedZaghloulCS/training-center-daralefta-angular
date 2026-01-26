import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'rooms', loadComponent: () => import('./Features/Rooms/Rooms.component').then(m => m.RoomsComponent) },
];
