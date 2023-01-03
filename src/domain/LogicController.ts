import { GroupType } from "../const/GroupType";
import { Level, LevelType } from "../dto/LevelInfo";
import { Library } from "../dto/Library";
import { OptionID, Quiz, QuizBuilder } from "../dto/Quiz";
import { UserData } from "../dto/UserData";
import { DepoProperties, ForexProperties, ILevelProperties, LoanProperties, PrexamProperties } from "./ILevelProperties";

const MAX_COMBO = 2;
const MAX_BOUNS = 4;

export class LogicController {
    private static _ctrl: LogicController;

    private user: UserData;
    private levelMap: Map<LevelType, Level> = new Map();
    private regularQuiz: Quiz[];
    private regularQuizOrder: number[];
    private currentQuizIndex: number = 0;
    private levelConfig: ILevelProperties = new DepoProperties();
    private remains: number = 0;

    private combo: number = 0;
    private bonusQuiz: Quiz[];
    private bonusQuizIndex: number = 0;
    private amountOfBonusQuiz: number = 0;

    private needToLearn: Boolean;

    private onFinishCallback: Function;
    private onGameOverCallback: Function;

    // For learning
    private library: Library[];

    private constructor() {
        console.log('[LogicController] constructor');
    }

    public static getInstance(): LogicController {
        if (!LogicController._ctrl) {
            LogicController._ctrl = new LogicController();
        }
        return LogicController._ctrl;
    }

    public getUser(): UserData {
        return this.user;
    }

    public setUser(userData: UserData): void {
        this.user = userData;
    }

    public getLevels(): Map<LevelType, Level> {
        return this.levelMap;
    }
    
    public setLevels(levels: Level[]): void {
        for(var index in levels) {
            var level = levels[index];
            this.levelMap.set(level.type, level);
        }
    }

    public setCurrentLevel(type: LevelType) {
        this.user.level = type;
        switch(type) {
            case LevelType.DEPOSIT:
                this.levelConfig = new DepoProperties();
                break;
            case LevelType.FOREX:
                this.levelConfig = new ForexProperties();
                break;
            case LevelType.LOAN:
                this.levelConfig = new LoanProperties();
                break;
            case LevelType.PREXAM:
                this.levelConfig = new PrexamProperties();
                break;
        }
        
    }

    public getCurrentLevel(): Level {
        return this.user ? this.levelMap.get(this.user.level) : null;
    }

    public getNextLevel(): Level {
        switch(this.user.level) {
            case LevelType.PREXAM:
                return this.levelMap.get(LevelType.DEPOSIT);
            case LevelType.DEPOSIT:
                return this.levelMap.get(LevelType.FOREX);
            case LevelType.FOREX:
                return this.levelMap.get(LevelType.LOAN);
            default:
                return null;
        }
    }

    public getCurrentLevelProperty(): ILevelProperties {
        return this.levelConfig;
    }

    public setQuizzes(quizzes: Quiz[]): void {
        this.regularQuiz = quizzes;
        // this.regularQuiz = this.mockQuizzes();
        // this.bonusQuiz = this.mockBonusQuizzes();
    }

    // TODO: for dev
    private mockQuizzes(): Quiz[] {
        var mockArr = [];
        for(let i=0; i<this.levelConfig.amountOfQuiz; i++) {
            let mockQuiz = new QuizBuilder()
                .id('' + i)
                .type(this.user.level)
                .description('You are now answering question[' + i + ']...')
                .answer(OptionID.A)
                .build();
            mockArr.push(mockQuiz);
        }
        return mockArr;
    }

    public setBonusQuizzes(extra: Quiz[]): void {
        this.bonusQuiz = extra;
        // extra.forEach(quiz => {
        //     this.regularQuiz.push(quiz);
        // });
    }

    public setLibrary(library: Library[]): void {
        this.library = library;
    }

    public getLibrary(): Library[] {
        return this.library;
    }

    public startQuiz(onFinish: Function, onGameOver: Function): void {
        this.regularQuizOrder = this.mutableRandom(this.levelConfig.amountOfQuiz);
        this.currentQuizIndex = -1;
        
        this.bonusQuizIndex = -1;
        this.amountOfBonusQuiz = 0;

        this.remains = this.levelConfig.maxRemains;
        this.combo = 0;

        this.needToLearn = false;

        this.onFinishCallback = onFinish;
        this.onGameOverCallback = onGameOver;
    }

    public nextQuiz(): Quiz {
        if (this.amountOfBonusQuiz > 0) {
            this.bonusQuizIndex ++;
        } else {
            this.currentQuizIndex ++;
        }
        return this.getCurrentQuiz();
    }

    private getCurrentQuiz(): Quiz {
        if (this.amountOfBonusQuiz > 0) {
            return this.bonusQuiz.at(this.bonusQuizIndex);
        } else {
            let index = this.regularQuizOrder.at(this.currentQuizIndex);
            return this.regularQuiz.at(index);
        }
    }

    public getCurrentQuizNumber(): number {
        return (this.currentQuizIndex + 1) + (this.bonusQuizIndex + 1);
    }

    public verify(option: OptionID, onAward: Function, onPenalty: Function, onBonus: Function): void {
        var curQuiz = this.getCurrentQuiz();
        var bingo = (option == curQuiz.answer);

        this.getCurrentLevel().points += bingo ? this.levelConfig.pointAward : this.levelConfig.pointPenalty;
        console.log('[LogicControl] point: ' + this.getCurrentLevel().points);
        if (this.getCurrentLevel().points < 0) {
            this.getCurrentLevel().points = 0;
        }

        if (this.amountOfBonusQuiz > 0) {
            this.amountOfBonusQuiz --;
        }

        if (bingo) {
            this.combo ++;
            if (this.user.level != LevelType.PREXAM && this.combo == MAX_COMBO) {
                this.combo = 0;
                if (this.user.group == GroupType.EXPERIMENTAL && this.bonusQuizIndex < MAX_BOUNS - 1) {
                    this.amountOfBonusQuiz = 2;
                    onBonus && onBonus();
                }
            }

            onAward && onAward(option.toString());
        } else {
            if (this.combo > 0) {
                this.combo --;
            }

            this.remains --;
            onPenalty && onPenalty(option.toString(), this.remains);
            if (this.remains == 0) {
                this.onGameOverCallback();
            }
        }

        if (this.currentQuizIndex == this.levelConfig.amountOfQuiz - 1) {
            if (this.remains != 0 && this.amountOfBonusQuiz == 0) {
                this.onFinishCallback && this.onFinishCallback();
            }
        }
    }

    private mutableRandom(size: number): number[] {
        let arr = [];
        for (let i=0; i<size; i++) {
            arr.push(i);
        }

        const output = [];
        for (let i = 0; i < size; i++) {
          const randomIndex = Math.floor(Math.random() * arr.length);
          output.push(arr[randomIndex]);
          arr.splice(randomIndex, 1);
        }
        return output;
      }


    public increaseTimesOfPrac(): void {
        this.getCurrentLevel().timesOfPrac ++;
        if (this.getCurrentLevel().timesOfPrac > 0) {
            this.getCurrentLevel().points += this.getCurrentLevel().timesOfPrac == 1 ? 300 : 100;
        }
    }

    public setNecessaryToLearn(toLearn: Boolean): void {
        this.needToLearn = toLearn;
    }

    public isNecessaryToLearn(): Boolean {
        return this.needToLearn;
    }

}