import { Firestore, getFirestore, collection, getDocs, doc, setDoc, getDoc, DocumentSnapshot, SnapshotOptions, updateDoc, serverTimestamp, where, query, orderBy, limit, WhereFilterOp } from "firebase/firestore";
import { GroupType } from "../const/GroupType";
import { TitleType } from "../const/TitleType";
import { Level, LevelType } from "../dto/LevelInfo";
import { UserData, UserDataBuilder } from "../dto/UserData";
import { DatabaseCore } from "./DatabaseCore";


const COLLECTION_NAME = 'userInfo';

export class UserInfoImpl {
    private firestore : Firestore;

    constructor() {
        this.firestore = getFirestore(DatabaseCore.getInstance().getApp());
    }

    async add(user: UserData, onSuccess : Function, onFailed : Function) : Promise<void> {
        try {
            const collectionRef = collection(this.firestore, COLLECTION_NAME);
            const docRef = doc(collectionRef, user.id);
            await setDoc(docRef, user);
          
            console.log("Document written with ID: ", docRef.id);
            onSuccess && onSuccess(user);
        } catch (e) {
            console.error("Error adding document: ", e);
            onFailed && onFailed();
        }
    }

    async get(uid: string) : Promise<UserData> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, uid).withConverter(UserInfoConverter);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    async getAmountOfGroupType(score: number, groupType: GroupType) : Promise<number> {
        const SCORE_THRESHOLD = 50
        const filter = score <= SCORE_THRESHOLD ? "<=" : ">";
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docQuery = query(collectionRef, where("entranceScore", filter, SCORE_THRESHOLD), where("group", "==", groupType));
        const docSnap = await getDocs(docQuery);
        return docSnap.size;
    }

    async update(uid: string, nextLevel: LevelType, points: number, title: TitleType) : Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, uid);
        return await updateDoc(docRef, {
            level: nextLevel,
            points: points,
            title: title,
            update_time: serverTimestamp()
        });
    }

    async updateGroup(uid: string, score: number, groupType: GroupType) : Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, uid);
        return await updateDoc(docRef, {
            entranceScore: score,
            group: groupType,
            assign_group_time: serverTimestamp()
        });
    }

    async updatePreVKSstatus(uid: string) : Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, uid);
        return await updateDoc(docRef, {
            isPreVKSDone: true,
        });
    }

    async updatePostVKSstatus(uid: string) : Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, uid);
        return await updateDoc(docRef, {
            isPostVKSDone: true,
        });
    }

    async updatePreExternalLink(uid: string) : Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, uid);
        return await updateDoc(docRef, {
            isPreExternalLink: true,
        });
    }

    async updatePostExternalLink(uid: string) : Promise<void> {
        const collectionRef = collection(this.firestore, COLLECTION_NAME);
        const docRef = doc(collectionRef, uid);
        return await updateDoc(docRef, {
            isPostExternalLink: true,
        });
    }
}


const UserInfoConverter = {
    toFirestore: (user: UserData) => {
        return user;
    },
    fromFirestore: (snapshot: DocumentSnapshot<UserData>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new UserDataBuilder()
            .id(data.id)
            .nickName(data.nickName)
            .group(data.group)
            .level(data.level)
            .points(data.points)
            .title(data.title)
            .entranceScore(data.entranceScore)
            .preExternalLink(data.isPreExternalLink)
            .postExternalLink(data.isPostExternalLink)
            .preVKSdone(data.isPreVKSDone)
            .postVKSdone(data.isPostVKSDone)
            .build();
    }
}