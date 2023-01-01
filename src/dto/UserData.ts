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
    isPreExternalLink: boolean;
    isPostExternalLink: boolean;
    isPreVKSDone: boolean;
    isPostVKSDone: boolean;
}


export class UserDataBuilder {
    private readonly _UserData: UserData;

    constructor() {
        this._UserData = {
            id: '',
            nickName: 'Advanturer',
            level: LevelType.DEPOSIT,
            group: null,
            points: 0,
            title: TitleType.T1,
            entranceScore: -1,
            isPreExternalLink: false,
            isPostExternalLink: false,
            isPreVKSDone: false,
            isPostVKSDone: false
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

    preExternalLink(done: boolean): UserDataBuilder {
        this._UserData.isPreExternalLink = done;
        return this;
    }

    postExternalLink(done: boolean): UserDataBuilder {
        this._UserData.isPostExternalLink = done;
        return this;
    }

    preVKSdone(done: boolean): UserDataBuilder {
        this._UserData.isPreVKSDone = done;
        return this;
    }

    postVKSdone(done: boolean): UserDataBuilder {
        this._UserData.isPostVKSDone = done;
        return this;
    }

    build(): UserData {
        return this._UserData;
    }
}

