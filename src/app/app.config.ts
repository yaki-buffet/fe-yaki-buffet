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
import { USER_ID } from './user-id.token';
import { CookieService } from 'ngx-cookie-service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: USER_ID,
      useFactory: (cookieService: CookieService) => {
        const id = cookieService.get('app_user_id');
        if (!id) {
          console.log('id not defined');
        }
        return id;
      },
      deps: [CookieService],
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
