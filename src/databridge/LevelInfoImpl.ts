import { DocumentSnapshot, Firestore, getFirestore, SnapshotOptions } from "firebase/firestore";
import { Level, LevelBuilder } from "../dto/LevelInfo";
import { DatabaseCore } from "./DatabaseCore";

const COLLECTION_NAME = 'levelInfo';

export class LevelInfoImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(levelInfo: Level, onSuccess : Function, onFailed : Function) : Promise<void> {

    }

    async get(userId: string) : Promise<Level> {
        return new Promise((resolve, reject) => {
        
        });
    }

    async update(level: Level): Promise<Level> {
        return new Promise((resolve, reject) => {
        
        });
    }
}

const LevelInfoConverter = {
    toFirestore: (level: Level) => {
        return level;
    },
    fromFirestore: (snapshot: DocumentSnapshot<Level>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new LevelBuilder()
            .uid(data.uid)
            .userName(data.userName)
            .type(data.type)
            .status(data.status)
            .points(data.points)
            .timeOfPrac(data.timesOfPrac)
            .build();
    }
}