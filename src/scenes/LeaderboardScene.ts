import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { LogicController } from "../domain/LogicController";
import { Level, LevelType } from "../dto/LevelInfo";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LeaderboardScene extends BaseLogPanelScene {
    private levelInfoApi: LevelInfoImpl;
    private recordTxtArray: Phaser.GameObjects.Text[] = [];

    constructor() {
        super('LeaderboardScene');
        this.levelInfoApi = new LevelInfoImpl();
    }

    override create(data?: any): void {
        super.create();
        this.showLog('create ' + JSON.stringify(data));

        this.add.rectangle(512, 384, 1024, 768, 0x000000, 80);

        var backToMain = this.make.text({
            x: 100,
            y: 700,
            text: 'Back',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        backToMain.setInteractive();
        backToMain.on('pointerdown', () => {
            this.scene.stop('LeaderboardScene');
        });

        this.scene.launch('LoadingScene');
        this.levelInfoApi.getLevelTop10(LogicController.getInstance().getCurrentLevel().type)
        .then((levels: Level[]) => {
            this.updateRank(levels);
            this.scene.stop('LoadingScene');
        })
        .catch(error => {
            this.showLog(error);
            this.scene.stop('LoadingScene');
        })
    }

    private updateRank(levels: Level[]): void {
        for(var index = 0; index < 10; index ++) {
            var recordTxt = this.make.text({
                x: 100,
                y: 100 + (index * 50),
                text: (index + 1) + '. -----',
                style: { font: 'bold 40px Arial', color: '#ffffff' }
            });
            recordTxt.setAlign('center');
            this.recordTxtArray[index] = recordTxt;
        }

        for (var index = 0; index < levels.length; index ++) {
            var level = levels[index];
            this.recordTxtArray[index].setText((index + 1) + '. ' + level.userName);
            this.make.text({
                x: 300,
                y: 100 + (index * 50),
                text: level.points + '',
                style: { font: 'bold 40px Arial', color: '#ffffff' }
            });
        }
    }
}