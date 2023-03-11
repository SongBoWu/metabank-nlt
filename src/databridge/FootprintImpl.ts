import { addDoc, collection, Firestore, getFirestore } from "firebase/firestore";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'footprint';

export class FootprintImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(footprint: any, onSuccess? : Function, onFailed? : Function) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            var docRef = await addDoc(collectionRef, footprint);

            return new Promise((resolve, reject) => {
                if (docRef) {
                    onSuccess && onSuccess(docRef.id);
                } else {
                    onFailed && onFailed('add failed');
                }
            });
        } catch (e) {
            console.log('[FootprintImpl] ' + JSON.stringify(e));
            onFailed && onFailed(e);
        }
    }
}