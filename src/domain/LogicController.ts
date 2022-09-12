import { Level, LevelType } from "../dto/LevelInfo";
import { OptionID, Quiz } from "../dto/Quiz";
import { UserData } from "../dto/UserData";
import { DepoProperties, ForexProperties, ILevelProperties, LoanProperties } from "./ILevelProperties";

const POINT_AWARD = 300;
const POINT_PENALTY = -200;
const MAX_COMBO = 2; 

export class LogicController {
    private static _ctrl: LogicController;

    private user: UserData;
    private levelMap: Map<LevelType, Level> = new Map();
    private regularQuiz: Quiz[];
    private bounsQuiz: Quiz[];
    private currentQuizIndex: number = 0;
    private levelConfig: ILevelProperties = new DepoProperties();

    private remains: number = 0
    private combo: number = 0;

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
        }
    }

    public getCurrentLevel(): Level {
        return this.levelMap.get(this.user.level);
    }

    public setQuizzes(quizzes: Quiz[]): void {
        this.regularQuiz = quizzes;
    }

    public extraQuizzes(extra: Quiz[]): void {
        extra.forEach(quiz => {
            this.regularQuiz.push(quiz);
        });
    }

    public setRoundBehaviors(): void {

    }

    public nextQuiz(): Quiz {
        this.currentQuizIndex ++;
        return this.getCurrentQuiz();
    }

    public previousQuiz(): Quiz {
        this.currentQuizIndex --;
        return this.getCurrentQuiz();
    }

    private getCurrentQuiz(): Quiz {
        return this.regularQuiz.at(this.currentQuizIndex);
    }

    public verify(option: OptionID, onAward: Function, onPenalty: Function): void {
        var bingo = (option == this.getCurrentQuiz().answer);


        if (bingo) {
            this.getCurrentLevel().points += POINT_AWARD;

            onAward && onAward();
        } else {
            this.getCurrentLevel().points += POINT_PENALTY;

            onPenalty && onPenalty(this.getCurrentQuiz().answer);
        }
    }

    private mutableRandom(): number[] {
        let size = this.levelConfig.amountOfQuiz;
        let arr = [];
        for (let i=1; i<=size; i++) {
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

}