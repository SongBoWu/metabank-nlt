export interface Level {
    uid: string;
    userName: string;
    type: LevelType;
    status: LevelStatus;
    points: number;
    timesOfPrac: number;
}

export enum LevelStatus {
    LOCKED,
    STARTED,
    FINISHED
}

export enum LevelType {
  DEPOSIT = "Deposit",
  FOREX = "Foreign Exchange",
  LOAN = "Loan",
}