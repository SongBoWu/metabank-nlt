import { addDoc, collection, doc, Firestore, getDocs, getFirestore, orderBy, query, setDoc, where } from "firebase/firestore";
import { HistoryType } from "../dto/historyBase";
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

    async getAllPractice(): Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("hType", "==", HistoryType.FARM), orderBy("uid", "desc"));
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

    async getAllRound(): Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("hType", "==", HistoryType.ROUND), orderBy("uid", "desc"));
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

    async getRoundHistory(userId: String): Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("uid", "==", userId), where("hType", "==", HistoryType.ROUND), orderBy("date_time", "desc"));
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

    async getAllVKSHistory(): Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("hType", "==", HistoryType.VKS), orderBy("uid", "desc"));
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