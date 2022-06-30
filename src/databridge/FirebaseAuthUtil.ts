import { getAnalytics } from "firebase/analytics";
import { Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { DatabaseCore } from "./DatabaseCore";

export class FirebaseAuthUtil {
    private auth : Auth;
    private currentUser : User;

    constructor() {
        this.auth = getAuth(DatabaseCore.getInstance().getApp());
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
