import { addDoc, collection, doc, DocumentSnapshot, Firestore, getDoc, getDocs, getFirestore, query, setDoc, SnapshotOptions, where } from "firebase/firestore";
import { Level, LevelBuilder, LevelType } from "../dto/LevelInfo";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'levelInfo';

export class LevelInfoImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(level: Level) : Promise<Level> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = await addDoc(collectionRef, level);
        
        return new Promise((resolve, reject) => {
            if (docRef) {
                resolve(level);
            } else {
                reject('add failed');
            }
        });
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

    async getLevel(uid: string, level: LevelType) : Promise<any> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("uid", "==", uid), where("type", "==", level));
        const docQuerySnapshot = await getDocs(docQuery);

        return new Promise((resolve, reject) => {
            if (docQuerySnapshot.size == 1) {
                resolve(docQuerySnapshot.docs.at(0).data());
            } else if (docQuerySnapshot.empty) {
                reject('empty result');
            } else { 
                reject('more than one result');
            }
        });
    }

    async update(level: Level): Promise<Level> {
        return new Promise((resolve, reject) => {
        
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