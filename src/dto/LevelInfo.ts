export enum LevelStatus {
    LOCKED = "LOCKED",
    STARTED = "STARTED",
    FINISHED = "FINISHED"
}

export enum LevelType {
    DEPOSIT = "Depo",
    FOREX = "ForEx",
    LOAN = "Loan"
}

export class Level {
    uid: string;
    userName: string;
    type: LevelType;
    status: LevelStatus;
    points: number;
    timesOfPrac: number;
}

export class LevelBuilder {
    private readonly _level: Level;

    constructor() {
        this._level = {
            uid: '',
            userName: 'Advanturer',
            type: LevelType.DEPOSIT,
            status: LevelStatus.LOCKED,
            points: 0,
            timesOfPrac: 0
        };
    }

    uid(uid: string): LevelBuilder {
        this._level.uid = uid;
        return this;
    }

    userName(name: string): LevelBuilder {
        this._level.userName = name;
        return this;
    }

    type(type: LevelType): LevelBuilder {
        this._level.type = type;
        return this;
    }
    
    status(status: LevelStatus): LevelBuilder {
        this._level.status = status;
        return this;
    }

    points(points: number): LevelBuilder {
        this._level.points = points;
        return this;
    }

    timeOfPrac(time: number): LevelBuilder {
        this._level.timesOfPrac = time;
        return this;
    }

    build(): Level {
        return this._level;
    }
}