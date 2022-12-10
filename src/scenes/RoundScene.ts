import { LogicController } from "../domain/LogicController";
import { BaseLogPanelScene } from "./BaseLogPanelScene";
import { OptionID, Quiz } from "../dto/Quiz";
import { GameObjects } from "phaser";
import { BannerConf } from "../dto/BannerConf";
import eventsCenter from "../plugins/EventsCenter";

export class RoundScene extends BaseLogPanelScene {

    private currentQuiz: Quiz;

    private totalAmount: number;

    private descPanelElement: GameObjects.DOMElement;
    private optBtns: GameObjects.Image[] = [];
    private optBtnHovers: GameObjects.Image[] = [];
    private optTexts: GameObjects.Text[] = [];

    private awardSound: Phaser.Sound.BaseSound;
    private wrongSound: Phaser.Sound.BaseSound;
    private gameOverSound: Phaser.Sound.BaseSound;
    private gameOverCamera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super('RoundScene');
    }

    override preload(): void {
        super.preload();

        this.load.html('desc_panel', 'assets/quiz_detail.html');
        this.load.image('button_bg', 'assets/opt_btn.png'); // #dfebe0
        this.load.image('button_hover_bg', 'assets/opt_btn_hover.png'); // #1a3d1d

        this.load.audio('awardAudio', 'assets/audios/award.wav');
        this.load.audio('wrongAudio', 'assets/audios/wrongAnswer.mp3');
        this.load.audio('gameOverAudio', 'assets/audios/gameOver.mp3');
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

        this.descPanelElement = this.add.dom(520, 150).createFromCache('desc_panel');
        this.awardSound = this.sound.add('awardAudio');
        this.wrongSound = this.sound.add('wrongAudio');
        this.gameOverSound = this.sound.add('gameOverAudio');

        this.gameOverCamera = this.cameras.add(0, 0, 1024, 768);

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

        this.setOptButtonsData();
    }

    private setOptButtonsData(): void {
        this.showLog(this.currentQuiz.description);

        var numberElement = this.descPanelElement.getChildByID('number');
        numberElement.innerHTML = LogicController.getInstance().getCurrentQuizNumber() + ' / ' + this.totalAmount;
        var descElement = this.descPanelElement.getChildByID('desc');
        descElement.innerHTML = this.currentQuiz.description;

        for(var index = 0; index < this.optTexts.length; index++) {
            this.optTexts[index].setText(this.getOptionIDfrom(index) + '. ' + this.currentQuiz.options[index].description);
        }
    }

    onOptionClickListener(oid: number): void {
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

    onVerified(): void {
        this.showLog('verify');
    }

    onAwarded(): void {
        this.showLog('You got award!');
        this.onShowUserPoints();
        this.awardSound.play();
    }

    onPunished(): void {
        this.showLog('You got wrong answer!');
        this.onShowUserPoints();
        this.wrongSound.play();
    }

    onBonus(): void {
        this.showLog('You got extra 2 questions!');
        this.totalAmount += 2;
    }

    onFinished(): void {
        this.showLog('round finished!');
        this.scene.start('GratzScene');
    }

    onGameOvered(): void {
        this.showLog('game over!!');
        this.gameOverSound.play();
        this.gameOverCamera.fade(1000, 0, 0, 0, true, (cam: any, progress: number) => {
            if (progress > 0.8) {
                this.scene.start('LevelScene', {
                    from: 'RoundScene',
                });
            }
        });
    }

    onShowUserPoints(): void {
        this.showLog('points in level: ' + LogicController.getInstance().getCurrentLevel().points);
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
        conf.isHitoBoard = true;
        eventsCenter.emit('onSettingUpdated', conf);
    }
}