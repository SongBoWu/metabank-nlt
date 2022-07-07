export enum OptionID {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

export class Option {
    id: OptionID;
    description: string;
}

export class Quiz {
    id: string;
    description: string;
    options: Option[];
    answer: string;
}

