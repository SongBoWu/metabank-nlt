import { addDoc, collection, Firestore, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore";
import { FootprintType } from "../dto/FootprintBase";
import { HistoryType } from "../dto/historyBase";
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

    async getFootprint(uid: String, type: FootprintType): Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("uid", "==", uid), where("fType", "==", type), orderBy("date_time", "desc"));
        const docSnap = await getDocs(docQuery);
        return new Promise((resolve, reject) => {
            if (!docSnap.empty) {
                var ret: Array<any> = [];
                docSnap.forEach(doc => {
                    ret.push(doc.data());
                })
                resolve(ret);
            } else {
                reject('No any history record!');
            }
        });
    }
}