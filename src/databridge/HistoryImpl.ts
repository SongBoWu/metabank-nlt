import { addDoc, collection, doc, Firestore, getFirestore, setDoc } from "firebase/firestore";
import { PracHistory } from "../dto/PracHistory";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'history';

export class HistoryImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(history: any, onSuccess? : Function, onFailed? : Function) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            var docRef = await addDoc(collectionRef, history);

            return new Promise((resolve, reject) => {
                if (docRef) {
                    onSuccess && onSuccess(docRef.id);
                } else {
                    onFailed && onFailed('add failed');
                }
            });
        } catch (e) {
            console.log('[HistoryImpl] ' + JSON.stringify(e));
            onFailed && onFailed(e);
        }
    }
}