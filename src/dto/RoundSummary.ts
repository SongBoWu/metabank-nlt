import { Timestamp } from "firebase/firestore";
import { RoundMode } from "../const/RoundMode";
import { HistoryBase, HistoryType } from "./historyBase";
import { LevelType } from "./LevelInfo";
import { OptionID } from "./Quiz";


export class RoundSlice {
    qid: string;
    selection: string;
    isCorrect: boolean;
}

export class RoundSummary extends HistoryBase {
    level: LevelType;
    quizzes: RoundSlice[];
    isPass: boolean;
}

export class RoundSliceBuilder {
    private readonly _rslice: RoundSlice;

    constructor() {
        this._rslice = {
            qid: '',
            selection: '',
            isCorrect: false
        }
    }

    id(id: string): RoundSliceBuilder {
        this._rslice.qid = id;
        return this;
    }

    selection(selection: string): RoundSliceBuilder {
        this._rslice.selection = selection;
        return this;
    }

    isCorrect(isCorrect: boolean): RoundSliceBuilder {
        this._rslice.isCorrect = isCorrect;
        return this;
    }

    build(): RoundSlice {
        return this._rslice;
    }
}

export class RoundSummaryBuilder {
    private readonly _rs: RoundSummary;

    constructor() {
        this._rs = {
            uid: '',
            uname: '',
            date_time: Timestamp.fromDate(new Date()),
            hType: HistoryType.ROUND,
            level: LevelType.DEPOSIT,
            quizzes: [],
            isPass: false
        };
    }

    uid(uid: string): RoundSummaryBuilder {
        this._rs.uid = uid;
        return this;
    }

    uname(name: string): RoundSummaryBuilder {
        this._rs.uname = name;
        return this;
    }

    hType(type: HistoryType): RoundSummaryBuilder {
        this._rs.hType = type;
        return this;
    }

    level(level: LevelType): RoundSummaryBuilder {
        this._rs.level = level;
        return this;
    }

    addQuiz(quiz: RoundSlice): RoundSummaryBuilder {
        this._rs.quizzes.push(quiz);
        return this;
    }

    quiz(quiz: RoundSlice[]): RoundSummaryBuilder {
        this._rs.quizzes = quiz;
        return this;
    }

    isPass(pass: boolean): RoundSummaryBuilder {
        this._rs.isPass = pass;
        return this;
    }

    build(): RoundSummary {
        return this._rs;
    }
}