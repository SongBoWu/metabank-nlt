import { Timestamp } from "firebase/firestore";
import { RoundMode } from "../const/RoundMode";
import { LevelType } from "./LevelInfo";
import { OptionID } from "./Quiz";

export class RoundSummary {
    uid: string;
    date_time: Timestamp;
    quizs: QuizSlice[];
    mode: RoundMode;
    level: LevelType;
}

export class QuizSlice {
    qid: string;
    selection: OptionID;
    traces: OptionTrace[];
}

export class OptionTrace {
    oid: OptionID;
    click_time: number;
}