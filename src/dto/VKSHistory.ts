import { Timestamp } from "firebase/firestore";
import { HistoryBase, HistoryType } from "./historyBase";

export enum VKSType {
    PRE = "pre",
    POST = "post",
}

export enum VKSScore {
    LEVEL_0,
    LEVEL_1,
    LEVEL_2,
    LEVEL_3,
}

export class VKSSlice {
    qid: string;
    word: string;
    score: VKSScore;
    translation: string;
    sentence: string;
}

export class VKSHistory extends HistoryBase {
    vType: VKSType;
    results: VKSSlice[];
}



export class VKSSliceBuilder {
    private readonly _vkslice: VKSSlice;

    constructor() {
        this._vkslice = {
            qid: '',
            word: '',
            score: VKSScore.LEVEL_0,
            translation: '',
            sentence: '',
        };
    }

    id(id: string): VKSSliceBuilder {
        this._vkslice.qid = id;
        return this;
    }

    word(word: string): VKSSliceBuilder {
        this._vkslice.word = word;
        return this;
    }

    score(score: VKSScore): VKSSliceBuilder {
        this._vkslice.score = score;
        return this;
    }

    translation(trans: string): VKSSliceBuilder {
        this._vkslice.translation = trans;
        return this;
    }

    sentence(sentence: string): VKSSliceBuilder {
        this._vkslice.sentence = sentence;
        return this;
    }

    build(): VKSSlice {
        return this._vkslice;
    }
}

export class VKSHistoryBuilder {
    private readonly _vksh: VKSHistory;

    constructor() {
        this._vksh = {
            uid: '',
            uname: '',
            date_time: Timestamp.fromDate(new Date()),
            hType: HistoryType.VKS,
            vType: VKSType.PRE,
            results: [],
        };
    }

    uid(uid: string): VKSHistoryBuilder {
        this._vksh.uid = uid;
        return this;
    }

    uname(name: string): VKSHistoryBuilder {
        this._vksh.uname = name;
        return this;
    }

    hType(type: HistoryType): VKSHistoryBuilder {
        this._vksh.hType = type;
        return this;
    }

    vType(type: VKSType): VKSHistoryBuilder {
        this._vksh.vType = type;
        return this;
    }

    result(results: VKSSlice[]): VKSHistoryBuilder {
        this._vksh.results = results;
        return this;
    }

    addResult(result: VKSSlice): VKSHistoryBuilder {
        this._vksh.results.push(result);
        return this;
    }

    build(): VKSHistory {
        return this._vksh;
    }
}