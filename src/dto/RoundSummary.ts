import { Timestamp } from "firebase/firestore";
import { RoundMode } from "../const/RoundMode";
import { LevelType } from "./LevelInfo";
import { OptionID } from "./Quiz";

export class RoundSummary {
    uid: string;
    date_time: Timestamp;
    quizzes: QuizSlice[];
    mode: RoundMode;
    level: LevelType;
}

export class QuizSlice {
    qid: string;
    selection: OptionID;
    click_time: number[];
}


export class RoundSummaryBuilder {
    private readonly _rs: RoundSummary;

    constructor() {
        this._rs = {
            uid: '',
            date_time: Timestamp.fromDate(new Date()),
            level: LevelType.DEPOSIT,
            mode: RoundMode.PRACTICE,
            quizzes: [],
        };
    }

    uid(uid: string): RoundSummaryBuilder {
        this._rs.uid = uid;
        return this;
    }

    level(level: LevelType): RoundSummaryBuilder {
        this._rs.level = level;
        return this;
    }

    mode(mode: RoundMode): RoundSummaryBuilder {
        this._rs.mode = mode;
        return this;
    }

    quiz(quiz: QuizSlice): RoundSummaryBuilder {
        this._rs.quizzes.push(quiz);
        return this;
    }

    build(): RoundSummary {
        return this._rs;
    }
}