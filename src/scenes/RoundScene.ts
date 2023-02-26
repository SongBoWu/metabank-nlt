import { LogicController } from "../domain/LogicController";
import { BaseLogPanelScene } from "./BaseLogPanelScene";
import { OptionID, Quiz } from "../dto/Quiz";
import { GameObjects } from "phaser";
import { BannerConf } from "../dto/BannerConf";
import eventsCenter from "../plugins/EventsCenter";
import { HistoryImpl } from "../databridge/HistoryImpl";
import { RoundSlice, RoundSliceBuilder, RoundSummaryBuilder } from "../dto/RoundSummary";

export class RoundScene extends BaseLogPanelScene {

    // DB impl
    private historyImpl: HistoryImpl;

    // Data
    private currentQuiz: Quiz;
    private totalAmount: number;
    private bonusTimes: number;
    private roundSlices: RoundSlice[] = [];

    // UI components - Main
    private descPanelElement: GameObjects.DOMElement;
    private optBtns: GameObjects.Image[] = [];
    private optBtnHovers: GameObjects.Image[] = [];
    private optBtnsWrong: GameObjects.Image[] = [];
    private optBtnsCorrect: GameObjects.Image[] = [];
    private optTexts: GameObjects.Text[] = [];
    private nextBtn: GameObjects.Image;

    // Audio components
    private awardSound: Phaser.Sound.BaseSound;
    private wrongSound: Phaser.Sound.BaseSound;
    private gameOverSound: Phaser.Sound.BaseSound;
    private gameOverCamera: Phaser.Cameras.Scene2D.Camera;

    // UI components - Life
    private lifeBar: Phaser.GameObjects.Graphics;
    private heartIcon: Phaser.GameObjects.Image;
    private heartEmptyIcon: Phaser.GameObjects.Image;

    // UI components - Bonus
    private bonusPopTxt: GameObjects.Text;

    constructor() {
        super('RoundScene');
        this.historyImpl = new HistoryImpl();
    }

    override preload(): void {
        super.preload();

        this.load.html('desc_panel', 'assets/quiz_detail.html');
        this.load.image('button_bg', 'assets/opt_btn.png'); // #131393
        this.load.image('button_hover_bg', 'assets/opt_btn_hover.png'); // #?
        this.load.image('button_wrong_icon', 'assets/opt_btn_wrong.png'); // #?
        this.load.image('button_correct_icon', 'assets/opt_btn_correct.png'); // #1a3d1d
        this.load.image('nextIcon', 'assets/icons/next_64.png');

        this.load.audio('awardAudio', 'assets/audios/award.wav');
        this.load.audio('wrongAudio', 'assets/audios/wrongAnswer.mp3');
        this.load.audio('gameOverAudio', 'assets/audios/gameOver.mp3');

        this.load.image('heart_icon', 'assets/icons/heart_64.png');
        this.load.image('heart_empty_icon', 'assets/icons/heart_empty_64.png');
    }

    override create(data?: any): void {
        super.create();

        console.log('onCreate ' + JSON.stringify(data));
        this.showBanner();

        LogicController.getInstance().startQuiz(
            this.onFinished.bind(this),
            this.onGameOvered.bind(this));

        this.currentQuiz = LogicController.getInstance().nextQuiz();
        this.totalAmount = LogicController.getInstance().getCurrentLevelProperty().amountOfQuiz;
        this.bonusTimes = 0;
        this.roundSlices = [];

        this.descPanelElement = this.add.dom(520, 150).createFromCache('desc_panel');
        this.awardSound = this.sound.add('awardAudio');
        this.wrongSound = this.sound.add('wrongAudio');
        this.gameOverSound = this.sound.add('gameOverAudio');

        this.gameOverCamera = this.cameras.add(0, 0, 1024, 768);

        var btn_x_coord = [250, 750];
        var btn_y_coord = [500, 600];

        var text_x_coord = [65, 565];
        var text_y_coord = [485, 585];

        for(var x_cor = 0; x_cor < btn_x_coord.length; x_cor ++) {
            for (var y_cor = 0; y_cor < btn_y_coord.length; y_cor ++) {
                var index = x_cor + Math.pow(2, y_cor) * y_cor;
                // console.log('index: ' + index + ', x: ' + x_cor + ", y: " + y_cor);

                this.optBtns[index] = this.add.image(btn_x_coord.at(x_cor), btn_y_coord.at(y_cor), 'button_bg');
                this.optBtnHovers[index] = this.add.image(btn_x_coord.at(x_cor), btn_y_coord.at(y_cor), 'button_hover_bg');
                this.optBtnsWrong[index] = this.add.image(btn_x_coord.at(x_cor), btn_y_coord.at(y_cor), 'button_wrong_icon');
                this.optBtnsCorrect[index] = this.add.image(btn_x_coord.at(x_cor), btn_y_coord.at(y_cor), 'button_correct_icon');
                this.optTexts[index] = this.make.text({
                    x: text_x_coord[x_cor],
                    y: text_y_coord[y_cor],
                    text: this.getOptionIDfrom(index) + '. ',
                    style: { font: 'bold 28px Arial', color: '#ffffff' }
                });

                
                var btn = this.optBtns.at(index);
                var btn_hover = this.optBtnHovers.at(index);
                var btn_wrong = this.optBtnsWrong.at(index);
                var btn_correct = this.optBtnsCorrect.at(index);
                btn_hover.setVisible(false);
                btn_wrong.setVisible(false);
                btn_correct.setVisible(false);

                btn.on('pointerdown', this.onOptionClickListener.bind(this, index) );
                btn.on('pointerover', this.onOptionBtnHoverIn.bind(this, index) );
                btn.on('pointerout', this.onOptionBtnHoverOut.bind(this, index) );
            }
        }

        this.nextBtn = this.add.image(100, 700, 'nextIcon');
        this.nextBtn.disableInteractive();
        this.nextBtn.setVisible(false);
        this.nextBtn.on('pointerdown', this.OnNextBtnClickListener.bind(this));

        this.setOptButtonsData();

        this.heartIcon = this.add.image(50, 90, 'heart_icon');
        this.heartEmptyIcon = this.add.image(50, 90, 'heart_empty_icon');
        this.heartEmptyIcon.setVisible(false);
        this.onLifeUpdate(-1);

        this.bonusPopTxt = this.make.text({
            x: 150,
            y: 170,
            text: '+2',
            style: { font: 'bold 28px Arial', color: '#ff5733' }
        })
        this.bonusPopTxt.setVisible(false);

        this.events.addListener('resume', this.resume.bind(this));
        this.events.addListener('pause', this.pause.bind(this));
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.events.removeListener('resume');
            this.events.removeListener('pause');
        });
    }

    resume(): void {
        console.log('[RoundScene][resume]');
        this.showBanner();
        this.descPanelElement.setVisible(true);
    } 
  
    private pause(): void {
        console.log('[RoundScene][pause]');
        this.descPanelElement.setVisible(false);
    }
    

    private setOptButtonsData(): void {
        this.showLog(this.currentQuiz.description);

        var numberElement = this.descPanelElement.getChildByID('number');
        numberElement.innerHTML = LogicController.getInstance().getCurrentQuizNumber() + ' / ' + this.totalAmount;
        var descElement = this.descPanelElement.getChildByID('desc');
        descElement.innerHTML = this.currentQuiz.description;

        for(var index = 0; index < this.optTexts.length; index++) {
            this.optTexts[index].setText(this.getOptionIDfrom(index) + '. ' + this.currentQuiz.options[index].description);
            this.optTexts[index].setData('optionData', this.currentQuiz.options.at(index));
            this.optBtns.at(index).setInteractive();
            this.optBtnsWrong.at(index).setVisible(false);
            this.optBtnsCorrect.at(index).setVisible(false);
        }
        this.nextBtn.disableInteractive();
        this.nextBtn.setVisible(false);
    }

    private onOptionClickListener(oid: number): void {
        var selectedOption = this.optTexts.at(oid).getData('optionData');
        LogicController.getInstance().verify(selectedOption, this.onAwarded.bind(this), this.onPunished.bind(this), this.onBonus.bind(this));

        for(var index = 0; index < this.optBtns.length; index++) {
            this.optBtns.at(index).disableInteractive();
        }

        this.optBtnsCorrect[oid].setVisible(selectedOption.isAnswer ? true : false);
        this.optBtnsWrong[oid].setVisible(selectedOption.isAnswer ? false : true);

        this.nextBtn.setInteractive();
        this.nextBtn.setVisible(true);
    }

    private onOptionBtnHoverIn(index: number): void {
        this.optBtnHovers.at(index).setVisible(true);
        this.optTexts[index].setColor('#131393');
    }

    private onOptionBtnHoverOut(index: number): void {
        this.optBtnHovers[index].setVisible(false);
        this.optTexts[index].setColor('#ffffff');
    }

    private OnNextBtnClickListener(): void {
        // Move to next quiz
        this.currentQuiz = LogicController.getInstance().nextQuiz();
        console.log('[RoundScene][OnNextBtnClickListener] currentQuiz: ' + JSON.stringify(this.currentQuiz.id));
        this.setOptButtonsData();
    }

    private onVerified(): void {
        this.showLog('verify');
    }

    private onAwarded(selection: string): void {
        this.showLog('You got award!');
        this.onShowUserPoints();
        this.awardSound.play();
        this.addRoundSlice(selection, true);
    }

    private onPunished(selection: string, remain: number): void {
        this.showLog('You got wrong answer! remain: ' + remain);
        this.onShowUserPoints();
        this.onLifeUpdate(remain);
        this.wrongSound.play();
        this.addRoundSlice(selection, false);
    }

    private onBonus(): void {
        this.showLog('You got extra 2 questions!');
        this.bonusTimes ++;
        this.totalAmount += 2;

        this.bonusPopTxt.setVisible(true);
        this.tweens.add({
            targets: this.bonusPopTxt,
            duration: 500,
            scaleX: 2,
            scaleY: 2,
            ease: 'Sine.easeInOut',
            repeat: 0,
            yoyo: true,
            onComplete: this.bonusPopCallback.bind(this)
        });

        this.descPanelElement.getChildByID('number').innerHTML = LogicController.getInstance().getCurrentQuizNumber() + ' / ' + this.totalAmount;
    }

    private bonusPopCallback(): void {
        this.bonusPopTxt.setVisible(false);
    }

    private onFinished(): void {
        this.showLog('round finished!');
        this.uploadLog(true);
        this.scene.start('GratzScene');
    }

    private onGameOvered(): void {
        this.showLog('game over!!');
        this.uploadLog(false);
        this.gameOverSound.play();
        this.gameOverCamera.fade(1000, 0, 0, 0, true, (cam: any, progress: number) => {
            if (progress > 0.8) {
                this.scene.start('LevelScene', {
                    from: 'RoundScene',
                });
            }
        });
    }

    private onShowUserPoints(): void {
        this.showLog('points in level: ' + LogicController.getInstance().getCurrentLevel().points);
    }

    private onLifeUpdate(remain: number): void {
        var levelProperty = LogicController.getInstance().getCurrentLevelProperty();
        var total = 720;
        var piece = total / levelProperty.maxRemains;

        this.lifeBar = this.add.graphics();
        this.lifeBar.fillStyle(0x2d2d2d);
        this.lifeBar.fillRect(90, 64, total + 6, 50);
        this.lifeBar.fillStyle(0xff5733);
        this.lifeBar.fillRect(93, 67, remain != -1 ? piece * remain : total, 44);
        if (remain == 0) {
            this.heartIcon.setVisible(false);
            this.heartEmptyIcon.setVisible(true);
        }
    }

    private onHTMLHided(isHide: boolean) {
        this.descPanelElement.setVisible(!isHide);
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

    private showBanner(): void {
        var conf = new BannerConf();
        conf.isPoint = true;
        conf.hasFootprint = true;
        conf.isHitoBoard = true;
        conf.curScene = 'RoundScene';
        eventsCenter.emit('onSettingUpdated', conf);
    }

    private addRoundSlice(selection: string, isCorrect: boolean) {
        console.log('[RoundScene][addRoundSlice] current: ' + this.currentQuiz.id);
        this.roundSlices.push(new RoundSliceBuilder()
            .id(this.currentQuiz.id)
            .selection(selection)
            .isCorrect(isCorrect)
            .build());
    }

    private uploadLog(pass: boolean) {
        var logSnippet = new RoundSummaryBuilder()
            .uid(LogicController.getInstance().getUser().id)
            .uname(LogicController.getInstance().getUser().nickName)
            .level(LogicController.getInstance().getCurrentLevel().type)
            .quiz(this.roundSlices)
            .isPass(pass)
            .bonusTimes(this.bonusTimes)
            .build();
        // console.log('[RoundScene][uploadLog] ' + JSON.stringify(logSnippet));
        this.historyImpl.add(logSnippet, this.onUploadLogSuccess.bind(this), this.onUploadLogFail.bind(this));
    }

    private onUploadLogSuccess(collectionId: string) {
        console.log('[RoundScene][onUploadLogSuccess] ' + collectionId);
    }

    private onUploadLogFail(e: any) {
        console.log('[RoundScene][onUploadLogFail] ' + JSON.stringify(e));

    }
}