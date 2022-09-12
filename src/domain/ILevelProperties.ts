
export interface ILevelProperties {
    amountOfQuiz: number;
    maxRemains: number;
}

export class DepoProperties implements ILevelProperties {
    amountOfQuiz: number = 7;
    maxRemains: number = 2;
}

export class ForexProperties implements ILevelProperties {
    amountOfQuiz: number = 9;
    maxRemains: number = 3;
}

export class LoanProperties implements ILevelProperties {
    amountOfQuiz: number = 11;
    maxRemains: number = 4;
}