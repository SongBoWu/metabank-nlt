import { Firestore, getFirestore, collection, getDocs, doc, setDoc, getDoc, DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { GroupType } from "../const/GroupType";
import { LevelType } from "../dto/LevelInfo";
import { TitleType } from "../const/TitleType";
import { UserData, UserDataBuilder } from "../dto/UserData";
import { DatabaseCore } from "./DatabaseCore";


const COLLECTION_NAME = 'userInfo';

export class FirestoreUserInfoUtil {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(user: UserData, onSuccess : Function, onFailed : Function) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            const docRef = doc(collectionRef, user.id);
            await setDoc(docRef, user);
          
            console.log("Document written with ID: ", docRef.id);
            onSuccess && onSuccess(user);
          } catch (e) {
            console.error("Error adding document: ", e);
            onFailed && onFailed();
          }
    }

    async get(userId: string) : Promise<UserData> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            const docRef = doc(collectionRef, userId).withConverter(UserInfoConverter);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                return docSnap.data();
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


const UserInfoConverter = {
    toFirestore: (user: UserData) => {
        return user;
    },
    fromFirestore: (snapshot: DocumentSnapshot<UserData>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new UserDataBuilder()
            .id(data.id)
            .nickName(data.nickName)
            .group(data.group)
            .level(data.level)
            .points(data.points)
            .title(data.title)
            .build();
    }
}