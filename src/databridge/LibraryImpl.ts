import { collection, doc, DocumentSnapshot, Firestore, getDocs, getFirestore, query, setDoc, SnapshotOptions, where } from "firebase/firestore";
import { LevelType } from "../dto/LevelInfo";
import { Library, LibraryBuilder } from "../dto/Library";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'library';

export class LibraryImpl {

    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(lib: Library, onSuccess? : Function, onFailed? : Function) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            const docRef = doc(collectionRef, lib.id);
             await setDoc(docRef, lib);

            onSuccess && onSuccess(lib);
        } catch (e) {
            onFailed && onFailed();
        }
    }

    async getList(type: LevelType) : Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        var docQuery = query(collectionRef, where("type", "==", type));
        
        const docQuerySnapshot = await getDocs(docQuery);
        
        return new Promise((resolve, reject) => {
            if (!docQuerySnapshot.empty) {
                var ret: Array<any> = [];
                docQuerySnapshot.forEach(doc => {
                    ret.push(doc.data());
                })
                resolve(ret);
            } else {
                reject('[ERROR] There is no any quiz!');
            }
        });
    }

    async getAllBasicWords() : Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        var docQuery = query(collectionRef, where("isBonus", "==", false));
        
        const docQuerySnapshot = await getDocs(docQuery);
        
        return new Promise((resolve, reject) => {
            if (!docQuerySnapshot.empty) {
                var ret: Array<any> = [];
                docQuerySnapshot.forEach(doc => {
                    ret.push(doc.data());
                })
                resolve(ret);
            } else {
                reject('[ERROR] There is no any quiz!');
            }
        });
    }
}

const LibConverter = {
    toFirestore: (lib: Library) => {
        return lib;
    },
    fromFirestore: (snapshot: DocumentSnapshot<Library>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new LibraryBuilder()
            .word(data.word)
            .phonetic(data.phonetic)
            .translation(data.translation)
            .wordTypes(data.wordTypes)
            .build();
    }
}