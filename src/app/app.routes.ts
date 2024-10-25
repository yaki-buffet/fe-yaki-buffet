import { Routes } from '@angular/router';
import { RouteParamsEnum } from './route-params.enum';

export const routes: Routes = [
  {
    path: `code/:${RouteParamsEnum.qrCodeId}`,
    loadComponent: () =>
      import('./buffet/buffet.component.js').then((m) => m.BuffetComponent),
  },
];
