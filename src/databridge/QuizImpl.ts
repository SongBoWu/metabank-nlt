import { DocumentSnapshot, Firestore, getFirestore, SnapshotOptions } from "firebase/firestore";
import { Quiz } from "../dto/Quiz";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'Quiz';

export class QuizImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(quiz: Quiz, onSuccess : Function, onFailed : Function) : Promise<void> {

    }

    async get(userId: string) : Promise<Quiz> {
        return new Promise((resolve, reject) => {
        
        });
    }

    async update(quiz: Quiz): Promise<Quiz> {
        return new Promise((resolve, reject) => {
        
        });
    }
}

const QuizConverter = {
    toFirestore: (quiz: Quiz) => {
        return quiz;
    },
    fromFirestore: (snapshot: DocumentSnapshot<Quiz>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new Quiz();
    }
}