import { Level, LevelType } from "../dto/LevelInfo";
import { OptionID, Quiz } from "../dto/Quiz";
import { UserData } from "../dto/UserData";

const POINT_AWARD = 300;
const POINT_PENALTY = -200;
const MAX_COMBO = 2; 
const MAX_REMAINS = 2; // 2 or 3 or 4
const MAX_AMOUNT_OF_QUIZ = 7; // 7 or 9 or 11;

export class LogicController {
    private static _ctrl: LogicController;

    private user: UserData;
    private levelMap: Map<LevelType, Level> = new Map();
    private regularQuiz: Quiz[];
    private bounsQuiz: Quiz[];
    private currentQuizIndex: number = 0;

    private remains: number = MAX_REMAINS;
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

    /**
     * Get available quiz id list
     * @param total the amount of quiz
     * @param max the max id of quiz
     */
    private randomQuiz(total: number, max: number): string[] {
        var list: string[];
        
        for (let i=0; i < total; i++) {
            var rqid = Math.floor(Math.random() * max) + 1;
            list.push(rqid.toString());
        }
        return list;
    }

}