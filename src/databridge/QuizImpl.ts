import { collection, doc, DocumentSnapshot, Firestore, getDoc, getDocs, getFirestore, query, setDoc, SnapshotOptions, where } from "firebase/firestore";
import { LevelType } from "../dto/LevelInfo";
import { Quiz, QuizBuilder } from "../dto/Quiz";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'quiz';

export class QuizImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(quiz: Quiz, onSuccess?: Function, onFailed?: Function) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            const docRef = doc(collectionRef, quiz.id);
             await setDoc(docRef, quiz);

            onSuccess && onSuccess(quiz);
        } catch (e) {
            onFailed && onFailed();
        }
    }

    async get(qid: string) : Promise<Quiz> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, qid).withConverter(QuizConverter);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data();
        }
    }

    async getList(type: LevelType, isBouns: Boolean, qids?: string[]) : Promise<any[]> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        var docQuery;
        if (qids) {
            docQuery = query(collectionRef, where("type", "==", type), where("isBonus", "==", isBouns), where("id", "in", qids));
        } else {
            docQuery = query(collectionRef, where("type", "==", type), where("isBonus", "==", isBouns));
        }
        
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
        return new QuizBuilder()
            .description(data.description)
            .options(data.options)
            .answer(data.answer)
            .build();
    }
}