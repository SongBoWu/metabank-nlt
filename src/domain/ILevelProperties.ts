
export interface ILevelProperties {
    amountOfQuiz: number;
    maxRemains: number;
}

export class DepoProperties implements ILevelProperties {
    amountOfQuiz: number = 3;
    maxRemains: number = 2;
}

export class ForexProperties implements ILevelProperties {
    amountOfQuiz: number = 5;
    maxRemains: number = 3;
}

export class LoanProperties implements ILevelProperties {
    amountOfQuiz: number = 7;
    maxRemains: number = 4;
}