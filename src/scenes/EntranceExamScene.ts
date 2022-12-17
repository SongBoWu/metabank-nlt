import { GameObjects } from "phaser";
import { GroupType } from "../const/GroupType";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { QuizImpl } from "../databridge/QuizImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { LevelStatus, LevelType } from "../dto/LevelInfo";
import { OptionID, Quiz } from "../dto/Quiz";
import { BaseLogPanelScene } from "./BaseLogPanelScene";
import { RoundScene } from "./RoundScene";

export class EntranceExamScene extends BaseLogPanelScene {
    private quizImpl: QuizImpl;
    private userInfoImpl: UserInfoImpl;
    private levelInfoImpl: LevelInfoImpl;
    
    private currentQuiz: Quiz;

    private totalAmount: number;

    private descPanelElement: GameObjects.DOMElement;
    private optBtns: GameObjects.Image[] = [];
    private optBtnHovers: GameObjects.Image[] = [];
    private optTexts: GameObjects.Text[] = [];

    constructor() {
        super('EntranceExamScene');
        this.quizImpl = new QuizImpl();
        this.userInfoImpl = new UserInfoImpl();
        this.levelInfoImpl = new LevelInfoImpl();
    }

    override preload(): void {
        super.preload();

        this.load.html('desc_panel', 'assets/quiz_detail.html');
        this.load.image('button_bg', 'assets/opt_btn.png'); // #dfebe0
        this.load.image('button_hover_bg', 'assets/opt_btn_hover.png'); // #1a3d1d
    }

    override create(data?: any): void {
        super.create();

        console.log('onCreate ' + JSON.stringify(data));

        LogicController.getInstance().setCurrentLevel(LevelType.PREXAM);
        

        this.descPanelElement = this.add.dom(520, 150).createFromCache('desc_panel');

        var btn_x_coord = [250, 750];
        var btn_y_coord = [550, 650];

        var text_x_coord = [65, 565];
        var text_y_coord = [535, 635];

        for(var x_cor = 0; x_cor < btn_x_coord.length; x_cor ++) {
            for (var y_cor = 0; y_cor < btn_y_coord.length; y_cor ++) {
                var index = x_cor + Math.pow(2, y_cor) * y_cor;
                // console.log('index: ' + index + ', x: ' + x_cor + ", y: " + y_cor);

                this.optBtns[index] = this.add.image(btn_x_coord.at(x_cor), btn_y_coord.at(y_cor), 'button_bg');
                this.optBtnHovers[index] = this.add.image(btn_x_coord.at(x_cor), btn_y_coord.at(y_cor), 'button_hover_bg');
                this.optTexts[index] = this.make.text({
                    x: text_x_coord[x_cor],
                    y: text_y_coord[y_cor],
                    text: this.getOptionIDfrom(index) + '. ',
                    style: { font: 'bold 28px Arial', color: '#1a3d1d' }
                });

                
                var btn = this.optBtns.at(index);
                var btn_hover = this.optBtnHovers.at(index);

                btn.setInteractive();
                btn_hover.setVisible(false);

                btn.on('pointerdown', this.onOptionClickListener.bind(this, index) );
                btn.on('pointerover', this.onOptionBtnHoverIn.bind(this, index) );
                btn.on('pointerout', this.onOptionBtnHoverOut.bind(this, index) );
            }
        }

        this.scene.launch('LoadingScene');

        this.quizImpl.getList(null, false)
            .then((quizzes: Quiz[]) => {
                this.showLog('[EntranceExam][GetQuiz] ' + quizzes.length);
                LogicController.getInstance().setCurrentLevel(LevelType.PREXAM);
                LogicController.getInstance().setQuizzes(quizzes);
                LogicController.getInstance().startQuiz(this.onFinished.bind(this), this.onGameOvered.bind(this));
                this.currentQuiz = LogicController.getInstance().nextQuiz();
                this.totalAmount = LogicController.getInstance().getCurrentLevelProperty().amountOfQuiz;
                this.setOptButtonsData();
                this.scene.stop('LoadingScene');
            })
            .catch((err: any) => {
                this.showLog('[EntranceExam][GetQuiz] ' + JSON.stringify(err));
                this.scene.stop('LoadingScene');
            }
        );

        
    }

    private setOptButtonsData(): void {
        // this.showLog(this.currentQuiz.description);

        var numberElement = this.descPanelElement.getChildByID('number');
        numberElement.innerHTML = LogicController.getInstance().getCurrentQuizNumber() + ' / ' + this.totalAmount;
        var descElement = this.descPanelElement.getChildByID('desc');
        descElement.innerHTML = this.currentQuiz.description;

        for(var index = 0; index < this.optTexts.length; index++) {
            this.optTexts[index].setText(this.getOptionIDfrom(index) + '. ' + this.currentQuiz.options[index].description);
        }
    }

    protected onOptionClickListener(oid: number): void {
        var clickOpt = this.getOptionIDfrom(oid);
        this.showLog('You clicked option ' + clickOpt);
        LogicController.getInstance().verify(clickOpt, this.onAwarded.bind(this), this.onPunished.bind(this), this.onBonus.bind(this));
        this.currentQuiz = LogicController.getInstance().nextQuiz();
        this.setOptButtonsData();
    }

    onOptionBtnHoverIn(index: number): void {
        this.optBtnHovers.at(index).setVisible(true);
        this.optTexts[index].setColor('#dfebe0');
    }

    onOptionBtnHoverOut(index: number): void {
        this.optBtnHovers[index].setVisible(false);
        this.optTexts[index].setColor('#1a3d1d');
    }
    
    private getOptionIDfrom(index: number): OptionID {
        var optionId;
        switch(index) {
            case 0:
                optionId = OptionID.A;
                break;
            case 1:
                optionId = OptionID.B;
                break;
            case 2:
                optionId = OptionID.C;
                break;
            case 3:
            default:
                optionId = OptionID.D;
                break;
        }
        return optionId;
    }
    
    onFinished(): void {
        this.showLog('round finished!');
        this.scene.launch('LoadingScene');

        var curLevel = LogicController.getInstance().getCurrentLevel();
        console.log('[getLastUserWhomAssignedGroup] curLevel: ' + JSON.stringify(curLevel));
        var expSize: number;
        this.userInfoImpl.getAmountOfGroupType(curLevel.points, GroupType.EXPERIMENTAL)
            .then(eSize => {
                console.log('[getLastUserWhomAssignedGroup] exp.size: ' + eSize);
                expSize = eSize;
                return this.userInfoImpl.getAmountOfGroupType(curLevel.points, GroupType.CONTROL);
            })
            .then(cSize => {
                console.log('[getLastUserWhomAssignedGroup] ctr.size: ' + cSize);
                var user = LogicController.getInstance().getUser();
                user.group = expSize <= cSize ? GroupType.EXPERIMENTAL : GroupType.CONTROL;
                return this.userInfoImpl.updateGroup(user.id, curLevel.points, user.group);
            })
            .then(() => {
                curLevel.status = LevelStatus.FINISHED;
                return this.levelInfoImpl.update(curLevel);
            })
            .then(() => {
                this.scene.stop('LoadingScene');
                this.scene.start('WelcomeScene');
            })
            .catch((err: string) => {
                console.log('[getLastUserWhomAssignedGroup] ' + err);
                this.scene.stop('LoadingScene');
            });
    }

    onGameOvered(): void {
        this.showLog('game over!!');
        // this.scene.start('LevelScene', {
        //     from: 'RoundScene',
        // });
    }

    onAwarded(): void {
        this.showLog('You got award!');
    }

    onPunished(): void {
        this.showLog('You got wrong answer!');
    }

    onBonus(): void {
        this.showLog('You got extra 2 questions!');
    }

}