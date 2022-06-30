import { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { UserData, UserDataBuilder } from "../dto/UserData";

export const userDataConverter = {
    toFirestore: (user: UserData) => {
        return new UserDataBuilder().build();
    },
    fromFirestore: (snapshot: DocumentSnapshot<UserData>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new UserDataBuilder().id(data.id).nickName(data.nickName).build();
    }
}