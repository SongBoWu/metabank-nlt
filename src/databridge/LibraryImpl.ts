import { collection, doc, Firestore, getFirestore, setDoc } from "firebase/firestore";
import { Library } from "../dto/Library";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'library';

export class LibraryImpl {

    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(lib: Library, onSuccess : Function, onFailed : Function) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            const docRef = doc(collectionRef, lib.id);
             await setDoc(docRef, lib);

            onSuccess && onSuccess(lib);
        } catch (e) {
            onFailed && onFailed();
        }
    }
}