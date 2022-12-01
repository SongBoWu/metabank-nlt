
export interface ILevelProperties {
    pointAward: number;
    pointPenalty: number;
    amountOfQuiz: number;
    maxRemains: number;
}

export class DepoProperties implements ILevelProperties {
    pointAward: number = 300;
    pointPenalty: number = -200;
    amountOfQuiz: number = 3;
    maxRemains: number = 2;
}

export class ForexProperties implements ILevelProperties {
    pointAward: number = 300;
    pointPenalty: number = -200;
    amountOfQuiz: number = 5;
    maxRemains: number = 3;
}

export class LoanProperties implements ILevelProperties {
    pointAward: number = 300;
    pointPenalty: number = -200;
    amountOfQuiz: number = 7;
    maxRemains: number = 4;
}

export class PrexamProperties implements ILevelProperties {
    pointAward: number = 6;
    pointPenalty: number = 0;
    amountOfQuiz: number = 15;
    maxRemains: number = 99;
}