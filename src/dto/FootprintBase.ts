import { Timestamp } from "firebase/firestore";

export enum FootprintType {
    LEADER_BOARD = "leaderboard",
    TRACE = "trace"
}

export class FootprintBase {
    uid: string;
    name: string;
    date_time: Timestamp;
    fType: FootprintType;
}

export class FootprintBuilder {
    private readonly _fp: FootprintBase;

    constructor() {
        this._fp = {
            uid: '',
            name: '',
            date_time: Timestamp.fromDate(new Date()),
            fType: FootprintType.LEADER_BOARD
        }
    }

    uid(uid: string): FootprintBuilder {
        this._fp.uid = uid;
        return this;
    }

    uname(name: string): FootprintBuilder {
        this._fp.name = name;
        return this;
    }


    type(type: FootprintType): FootprintBuilder {
        this._fp.fType = type;
        return this;
    }

    build(): FootprintBase {
        return this._fp;
    }
}