import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ring-of-fire-92dcc',
        appId: '1:434580599249:web:5d9ea3ccf242adab5870f0',
        storageBucket: 'ring-of-fire-92dcc.firebasestorage.app',
        apiKey: 'AIzaSyDdNTvo31QtB2pGPgI-1u1pEU_MrJFOuKI',
        authDomain: 'ring-of-fire-92dcc.firebaseapp.com',
        messagingSenderId: '434580599249',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
