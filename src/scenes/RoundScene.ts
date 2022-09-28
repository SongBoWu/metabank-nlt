import { LogicController } from "../domain/LogicController";
import { BaseLogPanelScene } from "./BaseLogPanelScene";
import { OptionID, Quiz } from "../dto/Quiz";

export class RoundScene extends BaseLogPanelScene {

    private optA: Phaser.GameObjects.Text;
    private optB: Phaser.GameObjects.Text;
    private optC: Phaser.GameObjects.Text;
    private optD: Phaser.GameObjects.Text;
    private currentQuiz: Quiz;

    constructor() {
        super('RoundScene');
    }

    override create(data?: any): void {
        super.create();

        this.cleanLog();
        console.log('on create ' + JSON.stringify(data));

        LogicController.getInstance().startQuiz(
            this.onFinished.bind(this),
            this.onGameOvered.bind(this));

        this.optA = this.make.text({
            x: 10,
            y: 500,
            text: 'A. ',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.optA.setInteractive();
        this.optA.on('pointerdown', this.onOptionClickListener.bind(this, OptionID.A));

        this.optB = this.make.text({
            x: 210,
            y: 500,
            text: 'B. ',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.optB.setInteractive();
        this.optB.on('pointerdown', this.onOptionClickListener.bind(this, OptionID.B));

        this.optC = this.make.text({
            x: 10,
            y: 550,
            text: 'C. ',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.optC.setInteractive();
        this.optC.on('pointerdown', this.onOptionClickListener.bind(this, OptionID.C));

        this.optD = this.make.text({
            x: 210,
            y: 550,
            text: 'D. ',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.optD.setInteractive();
        this.optD.on('pointerdown', this.onOptionClickListener.bind(this, OptionID.D));

        this.currentQuiz = LogicController.getInstance().nextQuiz();
        this.setOptButtonsData();
    }

    private setOptButtonsData(): void {
        this.showLog(this.currentQuiz.description);
        this.optA.setText(this.currentQuiz.options.at(0).description);
        this.optB.setText(this.currentQuiz.options.at(1).description);
        this.optC.setText(this.currentQuiz.options.at(2).description);
        this.optD.setText(this.currentQuiz.options.at(3).description);
    }

    onOptionClickListener(oid: OptionID): void {
        this.showLog('You clicked option ' + oid);
        LogicController.getInstance().verify(oid, this.onAwarded.bind(this), this.onPunished.bind(this), this.onBonus.bind(this));
        this.currentQuiz = LogicController.getInstance().nextQuiz();
        this.setOptButtonsData();
    }

    onVerified(): void {
        this.showLog('verify');
    }

    onAwarded(): void {
        this.showLog('You got award!');
        this.onShowUserPoints();
    }

    onPunished(): void {
        this.showLog('You got wrong answer!');
        this.onShowUserPoints();
    }

    onBonus(): void {
        this.showLog('You got extra 2 questions!');
    }

    onFinished(): void {
        this.showLog('round finished!');
        this.scene.start('GratzScene');
    }

    onGameOvered(): void {
        this.showLog('game over!!');
        this.scene.start('LevelScene', {
            from: 'RoundScene',
        });
    }

    onShowUserPoints(): void {
        this.showLog('points in level: ' + LogicController.getInstance().getCurrentLevel().points);
    }
}