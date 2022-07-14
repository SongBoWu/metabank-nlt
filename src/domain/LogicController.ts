import { Level } from "../dto/LevelInfo";
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
    private Level: Level;
    private quizzes: Quiz[];
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

    public setLevel(level: Level): void {
        this.Level = level;
    }

    public setQuizzes(quizzes: Quiz[]): void {
        this.quizzes = quizzes;
    }

    public extraQuizzes(extra: Quiz[]): void {
        extra.forEach(quiz => {
            this.quizzes.push(quiz);
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
        return this.quizzes.at(this.currentQuizIndex);
    }

    public verify(option: OptionID, onAward: Function, onPenalty: Function): void {
        var bingo = (option == this.getCurrentQuiz().answer);


        if (bingo) {
            this.Level.points += POINT_AWARD;

            onAward && onAward();
        } else {
            this.Level.points += POINT_PENALTY;

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