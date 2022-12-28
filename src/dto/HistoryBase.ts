import { Timestamp } from "firebase/firestore";

export enum HistoryType {
    ENTRANCE_EXAM = "entrance_exam",
    VKS = "vks",
    FARM = "farm",
    ROUND = "round",
}

export class HistoryBase {
    uid: string;
    uname: string;
    date_time: Timestamp;
    hType: HistoryType;
}
