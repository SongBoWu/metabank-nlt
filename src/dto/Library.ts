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
                    example: 'option A'
                }
            ]
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

    wordTypes(types: Array<WordType>): LibraryBuilder {
        this._lib.wordTypes = types;
        return this;
    }
}