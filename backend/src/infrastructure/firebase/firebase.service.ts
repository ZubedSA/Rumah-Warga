import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: App;

  onModuleInit() {
    try {
      this.app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error: any) {
      if (!/already exists/.test(error.message)) {
        console.error('Firebase Admin initialization error', error.stack);
      }
    }
  }

  getAuth(): Auth {
    return getAuth(this.app);
  }
}
