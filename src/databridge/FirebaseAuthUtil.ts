import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.API_KEY || '',
  authDomain: process.env.AUTH_DOMAIN || '',
  projectId: process.env.PROJECT_ID || '',
  storageBucket: process.env.STORAGE_BUCKET || '',
  messagingSenderId: process.env.MESSAGING_SENDER_ID || '',
  appId: process.env.APP_ID || '',
  measurementId: process.env.MEASUREMENT_ID || ''
};

export class FirebaseAuthUtil {
    private app : FirebaseApp;
    private auth : Auth;
    private currentUser : User;

    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
    }

    onAuthChanged(): void {
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            if (user) {
              console.log('[authChange] success: ', user);
            } else {
              console.log('[authChange] already signout');
            }
          });
    }

    signUp(email:string, password:string, onSuccess:Function, onFailed: Function): void {
        createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;

          console.log('[signUp] success: ', user);
          onSuccess && onSuccess(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log('[signUp] error: ', errorCode, errorMessage);
          onFailed && onFailed(errorCode);
        });
    }

    signIn(email:string, password:string): void {
        signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('[signIn] success: ', user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('[signIn] error: ', errorCode, errorMessage);
        });
    }

    signOut(): void {
        signOut(this.auth)
        .then(() => {
            console.log('[signOut] success! ');
        })
        .catch((error) => {
            console.log('[signOut] error: ', error.code, error.errorMessage);
        });
    }

    getUser(): User {
        return this.currentUser;
    }
}
