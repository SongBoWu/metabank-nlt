import { LevelType } from "./LevelInfo";

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
    type: LevelType;
    description: string;
    options: Option[];
    answer: OptionID;
}

export class QuizBuilder {
    private readonly _quiz: Quiz;

    constructor() {
        this._quiz = {
            id: '0000',
            type: LevelType.DEPOSIT,
            description: '',
            options: [
                {
                    id: OptionID.A,
                    description: 'option A'
                },
                {
                    id: OptionID.B,
                    description: 'option B'
                },
                {
                    id: OptionID.C,
                    description: 'option C'
                },
                {
                    id: OptionID.D,
                    description: 'option D'
                }
            ],
            answer: OptionID.A
        };
    }

    description(des: string): QuizBuilder {
        this._quiz.description = des;
        return this;
    }

    options(options: Array<Option>): QuizBuilder {
        this._quiz.options = options;
        return this;
    }

    answer(answer: OptionID): QuizBuilder {
        this._quiz.answer = answer;
        return this;
    }

    build(): Quiz {
        return this._quiz;
    }
}
