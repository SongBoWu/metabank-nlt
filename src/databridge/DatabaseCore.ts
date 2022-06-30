import { FirebaseApp, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.API_KEY || '',
    authDomain: process.env.AUTH_DOMAIN || '',
    projectId: process.env.PROJECT_ID || '',
    storageBucket: process.env.STORAGE_BUCKET || '',
    messagingSenderId: process.env.MESSAGING_SENDER_ID || '',
    appId: process.env.APP_ID || '',
    measurementId: process.env.MEASUREMENT_ID || ''
};

export class DatabaseCore {
    private static _core : DatabaseCore;
    private app : FirebaseApp;

    private constructor() {
        console.log('[FirebaseCore] constructor');
        this.app = initializeApp(firebaseConfig);
    }

    public static getInstance(): DatabaseCore {
        if (!this._core) {
            this._core = new DatabaseCore();
        }
        return this._core;
    }

    public getApp(): FirebaseApp {
        return this.app;
    }

}