export interface Quiz {
    id: string;
    description: string;
    options: Option[];
    answer: string;
}

export interface Option {
    id: OptionID;
    description: string;
}

export enum OptionID {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}