import { Timestamp } from "firebase/firestore";
import { HistoryBase, HistoryType } from "./historyBase";
import { LevelType } from "./LevelInfo";

export class PracSlice {
    qid: string;
    word: string;
    click_time: number;
}

export class PracHistory extends HistoryBase {
    level: LevelType;
    results: PracSlice[];
}

export class ParcSliceBuilder {
    private readonly _ps: PracSlice;
    constructor() {
        this._ps = {
            qid: '',
            word: '',
            click_time: 0
        }
    }

    id(id: string): ParcSliceBuilder {
        this._ps.qid = id;
        return this;
    }

    word(word: string): ParcSliceBuilder {
        this._ps.word = word;
        return this;
    }

    clickOnce(): ParcSliceBuilder {
        this._ps.click_time++;
        return this;
    }

    build(): PracSlice {
        return this._ps;
    }
}

export class PracHistoryBuilder {
    private readonly _ph: PracHistory;

    constructor() {
        this._ph = {
            uid: '',
            uname: '',
            date_time: Timestamp.fromDate(new Date()),
            hType: HistoryType.FARM,
            level: LevelType.DEPOSIT,
            results: []
        };
    }

    uid(uid: string): PracHistoryBuilder {
        this._ph.uid = uid;
        return this;
    }

    uname(name: string): PracHistoryBuilder {
        this._ph.uname = name;
        return this;
    }


    hType(type: HistoryType): PracHistoryBuilder {
        this._ph.hType = type;
        return this;
    }

    level(level: LevelType): PracHistoryBuilder {
        this._ph.level = level;
        return this;
    }

    result(results: PracSlice[]): PracHistoryBuilder {
        this._ph.results = results;
        return this;
    }

    addResult(result: PracSlice): PracHistoryBuilder {
        this._ph.results.push(result);
        return this;
    }

    build(): PracHistory {
        return this._ph;
    }
}