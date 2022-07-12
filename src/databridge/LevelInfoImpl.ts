import { addDoc, collection, doc, DocumentSnapshot, Firestore, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, SnapshotOptions, updateDoc, where } from "firebase/firestore";
import { Level, LevelBuilder, LevelType } from "../dto/LevelInfo";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'levelInfo';

export class LevelInfoImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(level: Level) : Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        var docId = level.uid + '_' + level.type;
        const docRef = doc(collectionRef, docId);
        return await setDoc(docRef, level);
    }

    async getLevels(uid: string) : Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("uid", "==", uid));
        const docQuerySnapshot = await getDocs(docQuery);
        
        return new Promise((resolve, reject) => {
            if (!docQuerySnapshot.empty) {
                var ret: Array<any> = [];
                docQuerySnapshot.forEach(doc => {
                    ret.push(doc.data());
                })
                resolve(ret);
            } else {
                reject('empty result');
            }
        });
    }

    async getLevel(uid: string, level: LevelType) : Promise<Level> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        var docId = uid + '_' + level;
        const docRef = doc(collectionRef, docId).withConverter(LevelInfoConverter);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    async update(level: Level): Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docId = level.uid + '_' + level.type;
        const docRef = doc(collectionRef, docId);
        return await updateDoc(docRef, {
            points: level.points,
            status: level.status,
            timesOfPrac: level.timesOfPrac,
            update_time: serverTimestamp()
        });
    }
}

const LevelInfoConverter = {
    toFirestore: (level: Level) => {
        return level;
    },
    fromFirestore: (snapshot: DocumentSnapshot<Level>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new LevelBuilder()
            .uid(data.uid)
            .userName(data.userName)
            .type(data.type)
            .status(data.status)
            .points(data.points)
            .timeOfPrac(data.timesOfPrac)
            .build();
    }
}