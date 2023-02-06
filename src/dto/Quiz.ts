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
    isAnswer: Boolean;
}

export class Quiz {
    id: string;
    type: LevelType;
    description: string;
    options: Option[];
    answer: OptionID;
    isBonus: Boolean;
}

export class QuizBuilder {
    private readonly _quiz: Quiz;

    constructor() {
        this._quiz = {
            id: '0000',
            type: null,
            description: '',
            options: [
                {
                    id: OptionID.A,
                    description: 'option A',
                    isAnswer: false
                },
                {
                    id: OptionID.B,
                    description: 'option B',
                    isAnswer: false
                },
                {
                    id: OptionID.C,
                    description: 'option C',
                    isAnswer: false
                },
                {
                    id: OptionID.D,
                    description: 'option D',
                    isAnswer: false
                }
            ],
            answer: OptionID.A,
            isBonus: false
        };
    }

    id(qid: string): QuizBuilder {
        this._quiz.id = qid;
        return this;
    }

    type(qtype: LevelType): QuizBuilder {
        this._quiz.type = qtype;
        return this;
    }

    description(des: string): QuizBuilder {
        this._quiz.description = des;
        return this;
    }

    options(options: Array<Option>): QuizBuilder {
        this._quiz.options = options;
        return this;
    }

    optionA(des: string): QuizBuilder {
        this._quiz.options[0].description = des;
        return this;
    }

    optionB(des: string): QuizBuilder {
        this._quiz.options[1].description = des;
        return this;
    }

    optionC(des: string): QuizBuilder {
        this._quiz.options[2].description = des;
        return this;
    }

    optionD(des: string): QuizBuilder {
        this._quiz.options[3].description = des;
        return this;
    }

    answer(answer: OptionID): QuizBuilder {
        this._quiz.answer = answer;
        return this;
    }

    isBonus(bonus: Boolean): QuizBuilder {
        this._quiz.isBonus = bonus;
        return this;
    }

    build(): Quiz {
        return this._quiz;
    }
}
