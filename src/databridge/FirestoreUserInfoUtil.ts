import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore, collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { GroupType } from "../const/GroupType";
import { LevelType } from "../const/LevelType";

const firebaseConfig = {
    apiKey: process.env.API_KEY || '',
    authDomain: process.env.AUTH_DOMAIN || '',
    projectId: process.env.PROJECT_ID || '',
    storageBucket: process.env.STORAGE_BUCKET || '',
    messagingSenderId: process.env.MESSAGING_SENDER_ID || '',
    appId: process.env.APP_ID || '',
    measurementId: process.env.MEASUREMENT_ID || ''
};

const COLLECTION_NAME = 'userInfo';

export class FirestoreUserInfoUtil {
    private app : FirebaseApp;
    private firestore : Firestore;

    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.firestore = getFirestore(this.app);
        console.log('firestore: ', this.firestore);
    }

    async add(userId: string, name ?: string) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            const docRef = doc(collectionRef, userId);
            await setDoc(docRef, {
              nickName: name,
              points: 0,
              group: GroupType.EXPERIMENTAL,
              level: LevelType.LOAN,
              title: "test",
              hasPracticed: false
            });
          
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    async get(userId: string) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            const docRef = doc(collectionRef, userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch (e) {
            console.error("Error getting document: ", e);
          }
    }

    async updatePoints(point: number, level?: LevelType, title?: string) : Promise<void> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, "userinfo"));
            querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            });
        } catch (e) {
            console.error("Error getting document: ", e);
          }
    }
}