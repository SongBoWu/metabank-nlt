import { addDoc, collection, doc, DocumentSnapshot, Firestore, getDoc, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, setDoc, SnapshotOptions, updateDoc, where, writeBatch } from "firebase/firestore";
import { Level, LevelBuilder, LevelStatus, LevelType } from "../dto/LevelInfo";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'levelInfo';

export class LevelInfoImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    private getDocId(levelInfo: Level): string {
        return levelInfo.uid + '_' + levelInfo.type;
    }

    async add(uid: string, uName: string) : Promise<void> {
        const batch = writeBatch(this.firestore);
        const collectionRef = collection(this.firestore, COLLECTION_NAME);

        var depLevel = new LevelBuilder().uid(uid).userName(uName).type(LevelType.DEPOSIT).build();
        var forLevel = new LevelBuilder().uid(uid).userName(uName).type(LevelType.FOREX).build();
        var loanLevel = new LevelBuilder().uid(uid).userName(uName).type(LevelType.LOAN).build();
        var prexamLevel = new LevelBuilder().uid(uid).userName(uName).type(LevelType.PREXAM).build();

        batch.set(doc(collectionRef, this.getDocId(depLevel)), depLevel);
        batch.set(doc(collectionRef, this.getDocId(forLevel)), forLevel);
        batch.set(doc(collectionRef, this.getDocId(loanLevel)), loanLevel);
        batch.set(doc(collectionRef, this.getDocId(prexamLevel)), prexamLevel);

        return await batch.commit();
        // return await setDoc(docRef, level);
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
                reject('No any level!');
            }
        });
    }

    async getLevelTop10(levelType: LevelType) : Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("type", "==", levelType), where("status", "==", LevelStatus.FINISHED), orderBy("points", "desc"), limit(10));
        const docQuerySnapshot = await getDocs(docQuery);
        
        return new Promise((resolve, reject) => {
            if (!docQuerySnapshot.empty) {
                var ret: Array<any> = [];
                docQuerySnapshot.forEach(doc => {
                    ret.push(doc.data());
                })
                resolve(ret);
            } else {
                reject('No any level!');
            }
        });
    }

    async update(level: Level): Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, this.getDocId(level));
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