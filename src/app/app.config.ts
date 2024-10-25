import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { USER_ID } from './user-id.token';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: USER_ID,
      useFactory: (cookieService: SsrCookieService) => {
        let id = cookieService.get('app_user_id');
        if (!id) {
          id = crypto.randomUUID();
          cookieService.set('app_user_id', id);
        }
        return id;
      },
      deps: [SsrCookieService],
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      }),
    ),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'yaki-buffet',
        appId: '1:414813220861:web:fafdbbce8f9309d2923394',
        storageBucket: 'yaki-buffet.appspot.com',
        apiKey: 'AIzaSyDpBAI17Um9KsNWdXIASHKRncYxL8EVfwk',
        authDomain: 'yaki-buffet.firebaseapp.com',
        messagingSenderId: '414813220861',
        measurementId: 'G-BJN3JVR9NJ',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
