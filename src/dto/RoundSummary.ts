import { RoundMode } from "../const/RoundMode";
import { LevelType } from "./LevelInfo";
import { OptionID } from "./Quiz";

export interface RoundSummary {
    uid: string;
    timestamp: number;
    quizs: QuizSlice[];
    mode: RoundMode;
    level: LevelType;
}

export interface QuizSlice {
    qid: string;
    selection: OptionID;
    traces: OptionTrace[];
}

export interface OptionTrace {
    oid: OptionID;
    times: number;
}