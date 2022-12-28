import { FirebaseApp, FirebaseError, initializeApp, setLogLevel } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import eventsCenter from "../plugins/EventsCenter";
import { AuthImpl } from "./AuthImpl";

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
    private authImpl: AuthImpl;

    private constructor() {
        console.log('[FirebaseCore] constructor');
        this.app = initializeApp(firebaseConfig);
        
        this.authImpl = new AuthImpl(this.app);
        this.authImpl.onAuthChanged();

        // setLogLevel('debug');
    }

    public static getInstance(): DatabaseCore {
        if (!DatabaseCore._core) {
            DatabaseCore._core = new DatabaseCore();
        }
        return DatabaseCore._core;
    }

    public getApp(): FirebaseApp {
        return this.app;
    }

    public getAuthImpl(): AuthImpl {
        return this.authImpl;
    }

}