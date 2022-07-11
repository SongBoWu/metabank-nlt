import { addDoc, collection, doc, DocumentSnapshot, Firestore, getFirestore, SnapshotOptions } from "firebase/firestore";
import { RoundSummary } from "../dto/RoundSummary";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'roundSummary';

export class RoundSummaryImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(rs: RoundSummary) : Promise<RoundSummary> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        var docRef = await addDoc(collectionRef, rs);

        return new Promise((resolve, reject) => {
            if (docRef) {
                resolve(rs);
            } else {
                reject('add failed');
            }
        });
    }

    async get(userId: string) : Promise<RoundSummary> {
        return new Promise((resolve, reject) => {
        
        });
    }

    async update(rs: RoundSummary): Promise<RoundSummary> {
        return new Promise((resolve, reject) => {
        
        });
    }
}

const RSConverter = {
    toFirestore: (rs: RoundSummary) => {
        return rs;
    },
    fromFirestore: (snapshot: DocumentSnapshot<RoundSummary>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new RoundSummary();
    }
}