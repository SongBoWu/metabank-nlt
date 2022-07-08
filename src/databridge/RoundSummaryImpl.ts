import { DocumentSnapshot, Firestore, getFirestore, SnapshotOptions } from "firebase/firestore";
import { RoundSummary } from "../dto/RoundSummary";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'RoundSummary';

export class RoundSummaryImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(rs: RoundSummary, onSuccess : Function, onFailed : Function) : Promise<void> {

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