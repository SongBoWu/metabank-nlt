import { LevelType } from "./LevelInfo";

export class WordType {
    type: string;
    example: string;
}

export class Library {
    id: string;
    type: LevelType;
    word: string;
    phonetic: string;
    translation: string;
    wordTypes: WordType[];
    isBonus: Boolean;
}

export class LibraryBuilder {
    private readonly _lib: Library;

    constructor() {
        this._lib = {
            id: '0000',
            type: LevelType.DEPOSIT,
            word: '',
            phonetic: '',
            translation: '',
            wordTypes: [
                {
                    type: '',
                    example: ''
                },
                {
                    type: '',
                    example: ''
                }
            ],
            isBonus: false
        };
    }

    id(id: string): LibraryBuilder {
        this._lib.id = id;
        return this;
    }

    type(type: LevelType): LibraryBuilder {
        this._lib.type = type;
        return this;
    }

    word(word: string): LibraryBuilder {
        this._lib.word = word;
        return this;
    }

    phonetic(phonetic: string): LibraryBuilder {
        this._lib.phonetic = phonetic;
        return this;
    }

    translation(trans: string): LibraryBuilder {
        this._lib.translation = trans;
        return this;
    }

    wordTypes(wordTypes: Array<WordType>): LibraryBuilder {
        this._lib.wordTypes = wordTypes;
        return this;
    }

    wordTypes1(type: string, example: string): LibraryBuilder {
        this._lib.wordTypes[0].type = type;
        this._lib.wordTypes[0].example = example;
        return this;
    }

    wordTypes2(type: string, example: string): LibraryBuilder {
        this._lib.wordTypes[1].type = type;
        this._lib.wordTypes[1].example = example;
        return this;
    }

    isBonus(bonus: Boolean): LibraryBuilder {
        this._lib.isBonus = bonus;
        return this;
    }

    build(): Library {
        return this._lib;
    }
}