import { GroupType } from "../const/GroupType";
import { LevelType } from "./LevelInfo";
import { TitleType } from "../const/TitleType";

export class UserData {
    id: string;
    nickName: string;
    level: LevelType;
    group: GroupType;
    points: number;
    title: TitleType;
    entranceScore: number;
}


export class UserDataBuilder {
    private readonly _UserData: UserData;

    constructor() {
        this._UserData = {
            id: '',
            nickName: 'Advanturer',
            level: LevelType.DEPOSIT,
            group: GroupType.EXPERIMENTAL,
            points: 0,
            title: TitleType.T1,
            entranceScore: 0,
        };
    }

    id(id: string): UserDataBuilder {
        this._UserData.id = id;
        return this;
    }

    nickName(nickName: string): UserDataBuilder {
        this._UserData.nickName = nickName;
        return this;
    }

    level(level: LevelType): UserDataBuilder {
        this._UserData.level = level;
        return this;
    }

    group(group: GroupType): UserDataBuilder {
        this._UserData.group = group;
        return this;
    }

    groupByScore(score: number): UserDataBuilder {
        this._UserData.group = score >= 300 ? GroupType.CONTROL : GroupType.EXPERIMENTAL;
        return this;
    }

    points(points: number): UserDataBuilder {
        this._UserData.points = points;
        return this;
    }

    title(title: TitleType): UserDataBuilder {
        this._UserData.title = title;
        return this;
    }

    entranceScore(score: number): UserDataBuilder {
        this._UserData.entranceScore = score;
        return this;
    }

    build(): UserData {
        return this._UserData;
    }
}

